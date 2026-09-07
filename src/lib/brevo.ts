import { Order, OrderItem } from "@/types/database";

interface SendOrderEmailParams {
  order: Order;
  items: OrderItem[];
}

export async function sendOrderEmails({ order, items }: SendOrderEmailParams) {
  const apiKey = process.env.BREVO_API_KEY;
  const storeEmail = process.env.STORE_ADMIN_EMAIL || "admin@mobiledeals.qa";

  // If no API key configured, gracefully log and return without failing order creation
  if (!apiKey) {
    console.info(
      `[Brevo] BREVO_API_KEY not configured. Order email skipped for ${order.order_reference}.`
    );
    return { success: false, reason: "API key not configured" };
  }

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">
          <strong>${item.product_name}</strong>
          ${item.variant_name ? `<br><small style="color: #666;">Variant: ${item.variant_name}</small>` : ""}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">QAR ${item.price.toLocaleString()}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;"><strong>QAR ${item.total_price.toLocaleString()}</strong></td>
      </tr>
    `
    )
    .join("");

  const emailBody = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
      <div style="background-color: #8A1538; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0; font-size: 22px; letter-spacing: 1px;">MOBILE DEALS</h1>
        <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">Cash on Delivery Order Confirmation</p>
      </div>
      
      <div style="padding: 24px; border: 1px solid #e5e5e5; border-top: none; border-radius: 0 0 8px 8px; background-color: #ffffff;">
        <h2 style="color: #8A1538; font-size: 18px; margin-top: 0;">Order Reference: ${order.order_reference}</h2>
        <p>Dear <strong>${order.customer_name}</strong>,</p>
        <p>Thank you for shopping with Mobile Deals! Your Cash on Delivery order has been received and is being prepared for fast delivery across Qatar.</p>
        
        <h3 style="border-bottom: 2px solid #8A1538; padding-bottom: 6px; margin-top: 24px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 8px; text-align: left;">Product</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Price</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right;">Subtotal:</td>
              <td style="padding: 8px; text-align: right;">QAR ${order.subtotal.toLocaleString()}</td>
            </tr>
            <tr>
              <td colspan="3" style="padding: 8px; text-align: right;">Delivery:</td>
              <td style="padding: 8px; text-align: right;">${order.delivery_fee === 0 ? "FREE" : `QAR ${order.delivery_fee}`}</td>
            </tr>
            <tr style="font-size: 16px; font-weight: bold; color: #8A1538;">
              <td colspan="3" style="padding: 8px; text-align: right;">Total Payable (COD):</td>
              <td style="padding: 8px; text-align: right;">QAR ${order.total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <h3 style="border-bottom: 2px solid #8A1538; padding-bottom: 6px;">Delivery Details</h3>
        <p style="font-size: 14px; line-height: 1.6; margin: 0;">
          <strong>Recipient:</strong> ${order.customer_name}<br>
          <strong>Phone:</strong> ${order.customer_phone}<br>
          <strong>Address:</strong> ${order.area}${order.zone ? `, Zone ${order.zone}` : ""}${order.street ? `, Street ${order.street}` : ""}${order.building ? `, Bldg/Villa ${order.building}` : ""}<br>
          ${order.delivery_notes ? `<strong>Notes:</strong> ${order.delivery_notes}<br>` : ""}
          <strong>Payment:</strong> Cash on Delivery
        </p>

        <div style="margin-top: 30px; padding: 15px; background-color: #fef2f2; border-left: 4px solid #8A1538; border-radius: 4px;">
          <p style="margin: 0; font-size: 13px; color: #7e1634;">
            Need quick assistance? Reach our Qatar customer team anytime on WhatsApp at <strong>+974 5500 0000</strong>.
          </p>
        </div>
      </div>
    </div>
  `;

  try {
    // 1. Send confirmation to customer (if email provided)
    if (order.customer_email) {
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "Mobile Deals", email: storeEmail },
          to: [{ email: order.customer_email, name: order.customer_name }],
          subject: `Order Confirmation #${order.order_reference} - Mobile Deals`,
          htmlContent: emailBody,
        }),
      });
    }

    // 2. Send notification to store admin
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Mobile Deals System", email: storeEmail },
        to: [{ email: storeEmail, name: "Store Admin" }],
        subject: `🚨 New Order #${order.order_reference} (QAR ${order.total}) - ${order.customer_name}`,
        htmlContent: emailBody,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("[Brevo] Email dispatch failed:", error);
    return { success: false, error };
  }
}
