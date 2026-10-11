'use client';

import React from 'react';
import { ShiftType } from '@/lib/billingMath';
import { DocketCompanyInfo } from '@/components/admin/QuotationDocket';

interface SurveyTransmittalLetterProps {
  company: DocketCompanyInfo;
  clientName: string;
  clientAddress: string;
  contactPerson?: string;
  clientPhone?: string;
  docRef: string;
  docDate: string;
  visitDate?: string;
  visitTimeSlot?: string;
  proposalSubject?: string;
  activeChosenServices?: any[];
  totalMonthlyBilling?: number;
  isApproved?: boolean;
}

const shiftLabel = (shift: ShiftType): string => (shift === '12_HOURS' ? '12-Hour Shift' : '08-Hour Shift');

export default function SurveyTransmittalLetter({
  company,
  clientName,
  clientAddress,
  contactPerson,
  clientPhone,
  docRef,
  docDate,
  visitDate,
  visitTimeSlot = '11:00 AM – 01:30 PM',
  activeChosenServices = [],
  isApproved = true
}: SurveyTransmittalLetterProps) {
  const dispatchRef = docRef ? `VSF/INSP/${docRef.replace(/\D/g, '') || '2026'}` : 'VSF/INSP/2026';
  const scheduledDate = visitDate || docDate;

  return (
    <div className="vsf-sheet bg-white text-slate-900 font-serif leading-relaxed">
      {/* Top Header Block */}
      <div className="space-y-4">
        {/* Letterhead Header */}
        <div className="w-full border-b-2 border-red-900 pb-3.5 flex items-center justify-between gap-4 font-sans">
          <div className="flex items-center gap-3.5 shrink-0">
            <img
              src={company.logo || '/assets/img/logo/logo.png'}
              alt="VSF Logo"
              className="w-16 h-16 object-contain"
              onError={(e: any) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="text-left leading-tight">
              <span className="text-[11px] font-mono font-black text-red-800 tracking-wider block">
                PROTECTION &bull; SECURITY
              </span>
              <span className="text-[14px] font-black text-slate-950 tracking-wide block">
                संरक्षण एवं सुरक्षा
              </span>
              <span className="text-[9.5px] font-mono text-slate-500 font-bold block mt-0.5">
                24/7 HELPLINE: +91 9826259020
              </span>
            </div>
          </div>

          <div className="text-center flex-1 px-2">
            <h1 className="text-[17px] font-black uppercase tracking-tight text-slate-950 leading-tight">
              {company.companyName}
            </h1>
            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide mt-1">
              HEAD OFFICE: {company.address}
            </p>
            <p className="text-[9.5px] font-mono font-semibold text-slate-600">
              Phone: {company.contactNo} &bull; Email: {company.email}
            </p>
          </div>

          <div className="text-right shrink-0 space-y-1 font-mono">
            <span className="inline-block text-[9.5px] font-black bg-red-50 border border-red-200 text-red-800 px-2.5 py-0.5 rounded uppercase">
              PSARA MP LICENSED
            </span>
            <span className="text-[10px] text-slate-700 font-bold block">
              LIC: {company.psaraLicense}
            </span>
          </div>
        </div>

        {/* Dispatch Reference Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono font-bold border-b border-slate-200 pb-2">
          <div>
            <span className="text-slate-500">DISPATCH REF: </span>
            <span className="text-red-900 font-black tracking-wide">{dispatchRef}</span>
          </div>
          <div>
            <span className="text-slate-500">DATE: </span>
            <span className="text-slate-900 font-black">{docDate}</span>
          </div>
        </div>

        {/* Recipient Institution Details */}
        <div className="bg-[#FAF9F5] border border-slate-200/90 rounded-xl p-3.5 space-y-1 font-sans">
          <p className="text-[9.5px] font-mono font-bold text-slate-500 uppercase tracking-wider">
            To,
          </p>
          <h2 className="text-[16px] font-black uppercase text-slate-950 leading-snug tracking-tight">
            The Management / Administration Authority
          </h2>
          <p className="text-[14px] font-bold text-slate-900 uppercase">
            {clientName || 'VALUED INSTITUTION / ORGANISATION'}
          </p>
          <div className="text-[12px] text-slate-700 pt-0.5 space-y-0.5">
            {contactPerson && (
              <p>
                <span className="text-slate-500 font-medium">Kind Attention:</span>{' '}
                <strong>{contactPerson}</strong> {clientPhone ? `(Ph: +91 ${clientPhone})` : ''}
              </p>
            )}
            <p>
              <span className="text-slate-500 font-medium">Campus Location:</span>{' '}
              {clientAddress || 'Institution Premises, Madhya Pradesh'}
            </p>
          </div>
        </div>

        {/* Subject */}
        <div className="p-2.5 bg-red-50/70 border border-red-200 rounded-lg text-slate-900 text-[12.5px] font-sans font-bold">
          <span className="text-red-900 uppercase font-black mr-1.5">Subject:</span>
          Prior Intimation for Scheduled Campus Inspection &amp; Premises Assessment Visit.
        </div>

        {/* Letter Body */}
        <div className="space-y-4 text-[13.5px] text-slate-800 leading-relaxed pt-1">
          <p>
            <strong>Dear Sir / Madam,</strong>
          </p>

          <p className="text-justify">
            Greetings from <strong>{company.companyName}</strong>.
          </p>

          <p className="text-justify">
            With reference to our ongoing communication, this is to confirm our upcoming visit to your campus for conducting an on-site physical security inspection and operational assessment:
          </p>

          {/* Appointment Schedule Box */}
          <div className="border border-red-900/60 rounded-xl bg-red-50/30 p-3 font-sans">
            <div className="grid grid-cols-2 gap-4 text-[12.5px] font-mono">
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase block">Proposed Date of Visit</span>
                <span className="font-black text-slate-950 text-sm">{scheduledDate}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] font-bold uppercase block">Designated Time Window</span>
                <span className="font-black text-red-900 text-sm">{visitTimeSlot}</span>
              </div>
            </div>
          </div>

          {/* Proposed Service Deployments (if configured) */}
          {activeChosenServices && activeChosenServices.length > 0 && (
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/80 font-sans space-y-1.5">
              <span className="text-[10px] font-mono font-black uppercase text-slate-700 tracking-wider block">
                Manpower Deployment Under Review:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11.5px] font-mono">
                {activeChosenServices.map((srv: any, idx: number) => (
                  <div key={idx} className="p-2 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                    <span className="font-bold text-slate-800 uppercase truncate mr-2">
                      {srv.label} ({shiftLabel(srv.shift)})
                    </span>
                    <span className="font-black text-red-900 shrink-0">
                      {srv.count} {srv.count === 1 ? 'Post' : 'Posts'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-justify">
            We look forward to meeting with your administrative team on the scheduled date to review the requirements and finalize our operational recommendations.
          </p>

          <p className="font-medium pt-2">
            Thanking you,<br />
            Yours faithfully,
          </p>
        </div>
      </div>

      {/* Corporate Signatory Footer with Database Stamp */}
      <div className="pt-3 border-t border-slate-200 flex justify-between items-end gap-6 mt-auto font-sans">
        <div className="text-[10px] font-mono text-slate-500 space-y-0.5">
          <p className="font-bold text-slate-800 text-[10.5px]">Vidhya Security Force &amp; Housekeeping Services</p>
          <p className="text-red-800 font-bold uppercase text-[9.5px]">Govt. of Madhya Pradesh PSARA Licensed &bull; Central HQ</p>
          <p className="text-[9px] text-slate-400">Dispatch Docket Ref: {dispatchRef}</p>
        </div>

        <div className="w-64 text-center">
          <p className="text-[10px] font-bold text-slate-700 uppercase mb-1">
            For {company.companyName}
          </p>

          {/* Official Seal / Stamp */}
          <div className="h-20 flex items-center justify-center my-0.5">
            {company.sealImage && isApproved ? (
              <img
                src={company.sealImage}
                alt="Official Seal"
                className="max-h-20 max-w-full object-contain filter drop-shadow-xs"
              />
            ) : (
              <div className="w-32 h-16 border border-dashed border-red-300 rounded flex items-center justify-center bg-red-50/20">
                <span className="text-[9px] font-mono font-bold text-red-800 uppercase">
                  [ OFFICIAL SEAL ]
                </span>
              </div>
            )}
          </div>

          <div className="border-t-2 border-slate-900 pt-1">
            <p className="text-[13px] font-black uppercase text-slate-950 tracking-wide">
              {company.directorName}
            </p>
            <p className="text-[10px] font-mono font-bold text-red-800 uppercase tracking-wider">
              Managing Director
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
