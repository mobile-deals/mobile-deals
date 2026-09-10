"use client";

import React, { useState } from "react";
import {
  Wrench,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Clock,
  HelpCircle,
  Sparkles,
  Phone,
  Mail,
  User,
  Smartphone,
  FileText,
  RotateCcw,
} from "lucide-react";

import { createServiceEnquiryAction } from "@/app/actions/admin";

interface ServiceEnquiryFormProps {
  whatsappNumber?: string;
  storeEmail?: string;
}

const SERVICE_TYPE_OPTIONS = [
  { value: "Repair Service", label: "📱 Repair Service (Screen, Battery, Hardware)" },
  { value: "Product Service", label: "🔍 Product Service & Diagnostics" },
  { value: "Maintenance", label: "⚙️ Routine Maintenance & Cleaning" },
  { value: "Warranty Service", label: "🛡️ Warranty Inspection & Claim" },
  { value: "Installation & Setup", label: "📲 Installation, Setup & Data Transfer" },
  { value: "Spare Parts", label: "🔩 Spare Parts & Accessories" },
  { value: "Other", label: "💬 Other Technical Support" },
];

const CONTACT_PREFERENCE_OPTIONS = [
  { value: "WhatsApp", label: "WhatsApp Chat (Instant & Fastest)" },
  { value: "Phone Call", label: "Direct Phone Call" },
  { value: "Email", label: "Email Response" },
];

export function ServiceEnquiryForm({
  whatsappNumber = "+97455000000",
  storeEmail = "support@mobiledeals.qa",
}: ServiceEnquiryFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [serviceType, setServiceType] = useState("Repair Service");
  const [productName, setProductName] = useState("");
  const [productModel, setProductModel] = useState("");
  const [contactPreference, setContactPreference] = useState("WhatsApp");
  const [issueDescription, setIssueDescription] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const [savedRefNo, setSavedRefNo] = useState<string | null>(null);

  const cleanWhatsappNumber = whatsappNumber.replace(/[^\d]/g, "");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    const cleanPhone = phone.replace(/[^\d+]/g, "");
    if (!phone.trim()) {
      newErrors.phone = "Please enter your mobile / WhatsApp number";
    } else if (cleanPhone.replace(/[^\d]/g, "").length < 7) {
      newErrors.phone = "Please enter a valid phone number (minimum 7 digits)";
    }

    if (!serviceType) {
      newErrors.serviceType = "Please select a service type";
    }

    if (!productName.trim()) {
      newErrors.productName = "Please specify the product, tool, or device name";
    }

    if (!issueDescription.trim()) {
      newErrors.issueDescription = "Please describe the problem or service requirement";
    } else if (issueDescription.trim().length < 5) {
      newErrors.issueDescription = "Please provide more details about the issue (at least 5 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateWhatsAppMessage = (refCode?: string | null) => {
    const lines = [
      "Hello Mobile Deals 👋 I would like to make a *Service Enquiry*.",
      refCode ? `🔖 *Reference:* #${refCode}` : null,
      "",
      "👤 *Customer Details:*",
      `• *Name:* ${name.trim()}`,
      `• *WhatsApp / Mobile:* ${phone.trim()}`,
      email.trim() ? `• *Email:* ${email.trim()}` : null,
      `• *Preferred Contact:* ${contactPreference}`,
      "",
      "🛠️ *Service Request Details:*",
      `• *Service Type:* ${serviceType}`,
      `• *Product / Device:* ${productName.trim()}`,
      productModel.trim() ? `• *Model / Code:* ${productModel.trim()}` : null,
      "",
      "📝 *Issue / Requirement:*",
      issueDescription.trim(),
      additionalDetails.trim()
        ? `\nℹ️ *Additional Details:*\n${additionalDetails.trim()}`
        : null,
      "",
      "--------------------------",
      "📍 _Submitted via Mobile Deals Qatar Service Portal_",
    ];

    return lines.filter((line) => line !== null).join("\n");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(errors)[0];
      const errorElem = document.getElementById(`field-${firstErrorKey}`);
      if (errorElem) {
        errorElem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Save to Supabase Database (Auto-generates reference code)
      const res = await createServiceEnquiryAction({
        customer_name: name,
        customer_phone: phone,
        customer_email: email || null,
        preferred_contact: contactPreference,
        service_type: serviceType,
        product_name: productName,
        product_model: productModel || null,
        issue_description: issueDescription,
        additional_details: additionalDetails || null,
      });

      const refNo = res?.referenceNo || `MD-SRV-${Math.floor(100000 + Math.random() * 900000)}`;
      setSavedRefNo(refNo);

      // 2. Build pre-filled WhatsApp message including the reference code
      const message = generateWhatsAppMessage(refNo);
      const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      setSubmittedUrl(whatsappUrl);

      // 3. Attempt to open WhatsApp directly
      const win = window.open(whatsappUrl, "_blank");
      if (!win || win.closed || typeof win.closed === "undefined") {
        // If popup was blocked on mobile or desktop, redirect current window
        window.location.href = whatsappUrl;
      }
    } catch (err) {
      console.error("Error submitting service enquiry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setServiceType("Repair Service");
    setProductName("");
    setProductModel("");
    setContactPreference("WhatsApp");
    setIssueDescription("");
    setAdditionalDetails("");
    setErrors({});
    setSubmittedUrl(null);
    setSavedRefNo(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Header Banner Card */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-[#8A1538]/40 text-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-neutral-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8A1538]/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span>Technical Support &amp; Repair Services</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
            Service Enquiry &amp; Support Request
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-2xl leading-relaxed">
            Need device repairs, technical maintenance, warranty inspection, or genuine spare parts? Complete the form below and submit your request directly to our service specialists on WhatsApp.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-[11px] sm:text-xs text-neutral-300 font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Certified Technicians</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Fast WhatsApp Response</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-300" />
              <span>Genuine Replacement Parts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Banner when submitted */}
      {submittedUrl && (
        <div className="mb-8 p-6 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-md animate-fade-in">
          <div className="flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-bold text-emerald-900">
                  Enquiry Form Completed &amp; Archived!
                </h3>
                {savedRefNo && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-200/80 text-emerald-900 font-mono text-xs font-black">
                    Ref: #{savedRefNo}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-700 leading-relaxed">
                WhatsApp should have opened with your enquiry details pre-filled. If it did not open automatically, tap the button below:
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fb855] text-white text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Open WhatsApp Enquiry Chat</span>
                </a>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Enquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 md:p-10 space-y-6"
      >
        {/* Section 1: Customer Contact Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <User className="w-4 h-4 text-[#8A1538]" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              1. Customer Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Customer Name */}
            <div id="field-name" className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                Full Name <span className="text-[#8A1538]">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  placeholder="e.g. Mohammed Al-Kuwari"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none transition-all ${
                    errors.name
                      ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-neutral-200 focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Mobile / WhatsApp Number */}
            <div id="field-phone" className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                Mobile / WhatsApp Number <span className="text-[#8A1538]">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  placeholder="e.g. +974 5500 0000 or 3300 0000"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none transition-all ${
                    errors.phone
                      ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                      : "border-neutral-200 focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
                  }`}
                />
              </div>
              {errors.phone && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.phone}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                Email Address <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] transition-all"
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                Preferred Contact Method
              </label>
              <select
                value={contactPreference}
                onChange={(e) => setContactPreference(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 focus:bg-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] transition-all cursor-pointer"
              >
                {CONTACT_PREFERENCE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Product & Service Details */}
        <div className="space-y-4 pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
            <Smartphone className="w-4 h-4 text-[#8A1538]" />
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
              2. Service &amp; Product Details
            </h2>
          </div>

          {/* Service Type Dropdown */}
          <div id="field-serviceType" className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              Service Type <span className="text-[#8A1538]">*</span>
            </label>
            <select
              value={serviceType}
              onChange={(e) => {
                setServiceType(e.target.value);
                if (errors.serviceType) setErrors((prev) => ({ ...prev, serviceType: "" }));
              }}
              className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border text-xs sm:text-sm text-neutral-900 focus:bg-white focus:outline-none transition-all cursor-pointer ${
                errors.serviceType
                  ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-neutral-200 focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
              }`}
            >
              {SERVICE_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.serviceType && (
              <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.serviceType}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product / Device / Tool Name */}
            <div id="field-productName" className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                Product / Device Name <span className="text-[#8A1538]">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => {
                  setProductName(e.target.value);
                  if (errors.productName) setErrors((prev) => ({ ...prev, productName: "" }));
                }}
                placeholder="e.g. iPhone 15 Pro Max / iPad Air / Anker PowerBank"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none transition-all ${
                  errors.productName
                    ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-neutral-200 focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
                }`}
              />
              {errors.productName && (
                <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{errors.productName}</span>
                </p>
              )}
            </div>

            {/* Model / Code / Serial */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-800">
                Model / Code / Color <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={productModel}
                onChange={(e) => setProductModel(e.target.value)}
                placeholder="e.g. Model A3102 / 256GB Natural Titanium"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] transition-all"
              />
            </div>
          </div>

          {/* Issue / Service Requirement */}
          <div id="field-issueDescription" className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              Issue / Service Requirement Description <span className="text-[#8A1538]">*</span>
            </label>
            <textarea
              rows={3}
              value={issueDescription}
              onChange={(e) => {
                setIssueDescription(e.target.value);
                if (errors.issueDescription) setErrors((prev) => ({ ...prev, issueDescription: "" }));
              }}
              placeholder="Please describe the issue, damage, symptoms, or service required in detail (e.g., Cracked front display screen, battery drains quickly, device not charging)..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none transition-all ${
                errors.issueDescription
                  ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  : "border-neutral-200 focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538]"
              }`}
            />
            {errors.issueDescription && (
              <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.issueDescription}</span>
              </p>
            )}
          </div>

          {/* Additional Details */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-800">
              Additional Details / Preferred Appointment Time <span className="text-neutral-400 font-normal">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              placeholder="Any specific delivery location in Qatar, urgent timeline, or special instructions..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:border-[#8A1538] focus:ring-1 focus:ring-[#8A1538] transition-all"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-neutral-100 space-y-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg shadow-[#25D366]/20 transition-all cursor-pointer disabled:opacity-60"
          >
            <MessageCircle className="w-5 h-5 fill-white shrink-0" />
            <span>{isSubmitting ? "Generating WhatsApp Enquiry..." : "Send Enquiry on WhatsApp"}</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </button>

          <p className="text-center text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
            <span>
              Your information is securely encrypted and submitted directly to official Mobile Deals support on WhatsApp.
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
