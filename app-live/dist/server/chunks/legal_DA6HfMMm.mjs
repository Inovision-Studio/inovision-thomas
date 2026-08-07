const LEGAL_EFFECTIVE = "July 4, 2026";
const COMPANY = {
  name: "Inovision Studios LLC",
  state: "Michigan",
  address: "445 S Livernois Rd, Suite 333, Rochester Hills, MI 48307",
  email: "Inovisionstudiosllc@gmail.com",
  phone: "+1 (248) 678-4679"
};
const TERMS = [
  { h: "1. Agreement to these Terms", p: [
    `These Terms of Service ("Terms") are a binding contract between you ("Client," "you") and ${COMPANY.name}, a ${COMPANY.state} limited liability company ("Inovision," "we," "us"). By checking the acceptance boxes during onboarding, signing a proposal, submitting a deposit, or using our services, you agree to these Terms and to our Privacy Policy.`,
    `If you are entering into these Terms on behalf of a company or other entity, you represent that you have authority to bind that entity.`
  ] },
  { h: "2. Services", p: [
    `We provide website design and development, full-stack software development, hosting, and optional AI-integration services. The specific deliverables, plan, and price for your engagement are those shown at onboarding and/or in a written proposal, which is incorporated into these Terms.`,
    `We only build what is agreed. Any add-ons, extra pages, features, or scope changes are discussed and approved by you before we commit to them, and may adjust price and timeline.`
  ] },
  { h: "3. Timeline", p: [
    `Our target is to deliver from initial specification to completed deployment within approximately three (3) months, provided you supply required content, approvals, and access promptly. Timelines are good-faith estimates, not guarantees, and pause during periods where we are awaiting materials, feedback, or payment from you.`
  ] },
  { h: "4. Fees, Deposits & Payment", p: [
    `To begin work you pay a non-refundable deposit equal to fifty percent (50%) of the project fee. The remaining balance is invoiced at launch and is due before or upon the site going live.`,
    `Recurring services — hosting ($20/month) and, if selected, AI integration ($70/month) — begin billing after your site launches and continue monthly until cancelled with at least thirty (30) days' notice. Prices for add-ons and recurring services are disclosed before you commit; there are no hidden fees.`,
    `Payments are processed by Stripe. You authorize us to charge the payment method you provide for amounts you approve. Late balances may be subject to a 1.5% monthly late charge (or the maximum allowed by law) and may result in suspension of services. You agree not to initiate chargebacks for services rendered; billing disputes will be raised with us first.`
  ] },
  { h: "5. Your Responsibilities", p: [
    `You agree to provide, in a timely manner, all content, brand assets, credentials, and approvals we reasonably request, and to ensure you own or are licensed to use everything you provide to us. You are responsible for the legality of your business and the materials you supply.`
  ] },
  { h: "6. Revisions & Scope", p: [
    `Your plan includes a reasonable number of revision rounds within the agreed scope. Work beyond the agreed scope is a change order, quoted and approved before it begins.`
  ] },
  { h: "7. Intellectual Property", p: [
    `Upon full payment of all amounts due, you own the final deliverables produced specifically for you, except for: (a) third-party or open-source components, which remain under their own licenses; (b) our pre-existing tools, frameworks, and know-how, which we license to you non-exclusively for use with the deliverables; and (c) AI-provider components governed by their providers' terms.`,
    `We may display the work in our portfolio and reference you as a client unless you request otherwise in writing.`
  ] },
  { h: "8. Hosting & Maintenance", p: [
    `Hosting is provided on a commercially reasonable, best-effort basis. We do not guarantee uninterrupted or error-free service or any specific uptime unless separately agreed in writing. We perform routine backups but you are responsible for retaining your own copies of critical content. Either party may terminate recurring services on thirty (30) days' notice; fees already paid are non-refundable.`
  ] },
  { h: "9. AI Features", p: [
    `Optional AI features may use third-party providers (including DAIEJA 2.0 and other model providers). AI output can be inaccurate or unexpected; you are responsible for reviewing AI output before relying on it. AI features are provided without warranty of accuracy, and are subject to the providers' terms and availability.`
  ] },
  { h: "10. Disclaimer of Warranties", p: [
    `EXCEPT AS EXPRESSLY STATED, SERVICES AND DELIVERABLES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.`
  ] },
  { h: "11. Limitation of Liability", p: [
    `TO THE MAXIMUM EXTENT PERMITTED BY LAW, INOVISION WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOST PROFITS OR DATA. OUR TOTAL LIABILITY FOR ANY CLAIM ARISING FROM OR RELATED TO THE SERVICES WILL NOT EXCEED THE AMOUNT YOU PAID TO US FOR THE SERVICES GIVING RISE TO THE CLAIM IN THE THREE (3) MONTHS BEFORE THE CLAIM.`
  ] },
  { h: "12. Indemnification", p: [
    `You agree to indemnify and hold Inovision harmless from claims, damages, and expenses arising out of content or materials you provide, your use of the deliverables, or your breach of these Terms.`
  ] },
  { h: "13. Governing Law", p: [
    `These Terms are governed by the laws of the State of ${COMPANY.state}, without regard to its conflict-of-laws rules. Subject to the arbitration provision below, the exclusive venue for any permitted court action is the state or federal courts located in Macomb County, ${COMPANY.state}.`
  ] },
  { h: "14. Binding Arbitration", p: [
    `PLEASE READ CAREFULLY — THIS AFFECTS YOUR LEGAL RIGHTS. Except for small-claims matters and requests for injunctive relief to protect intellectual property, any dispute, claim, or controversy arising out of or relating to these Terms or the services shall be resolved exclusively by final and binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules, before a single arbitrator, seated in Macomb County, ${COMPANY.state}.`,
    `The arbitrator's decision is final and may be entered as a judgment in any court of competent jurisdiction. By agreeing, both parties knowingly and voluntarily WAIVE THE RIGHT TO A TRIAL IN COURT AND TO A JURY TRIAL.`
  ] },
  { h: "15. Class Action Waiver", p: [
    `ALL CLAIMS MUST BE BROUGHT IN AN INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, COLLECTIVE, OR REPRESENTATIVE PROCEEDING. The arbitrator may not consolidate more than one person's claims.`
  ] },
  { h: "16. Force Majeure", p: [
    `Neither party is liable for delays or failures caused by events beyond its reasonable control, including outages, provider failures, natural events, or governmental actions.`
  ] },
  { h: "17. General", p: [
    `These Terms, together with your accepted proposal and our Privacy Policy, are the entire agreement between us and supersede prior discussions. If any provision is held unenforceable, the rest remains in effect. Our failure to enforce a provision is not a waiver. You may not assign these Terms without our consent; we may assign them to a successor.`,
    `Questions: ${COMPANY.email} · ${COMPANY.phone} · ${COMPANY.address}.`
  ] }
];
const PRIVACY = [
  { h: "1. Information We Collect", p: [
    `We collect information you give us — such as your name, business name, email, phone, project details, and account credentials — and limited technical data (such as IP address and browser type) automatically when you use the site or portal. When you accept our Terms, we record the date, time, and IP address of your acceptance as proof of agreement.`
  ] },
  { h: "2. How We Use Information", p: [
    `We use your information to provide and deliver services, communicate with you, process payments, track your project's progress, maintain security, keep records of agreements, and comply with law.`
  ] },
  { h: "3. Payments", p: [
    `Payments are processed by Stripe, Inc. We do not store your full card number. Stripe processes card data under its own privacy and security terms (PCI-DSS). We retain records such as amounts, dates, invoice references, and payment status.`
  ] },
  { h: "4. How We Share Information", p: [
    `We share information only with service providers that help us operate — such as Stripe (payments), our hosting provider, and AI providers including DAIEJA 2.0 for optional AI features — and only as needed to provide the services. We may disclose information if required by law or to protect our rights. We do not sell your personal information.`
  ] },
  { h: "5. Cookies", p: [
    `We use strictly necessary cookies to keep you logged into the portal and to keep the site working. We may use minimal analytics to understand site usage.`
  ] },
  { h: "6. Data Retention & Security", p: [
    `We keep information for as long as needed to provide services and to meet legal, accounting, and record-keeping obligations. We use reasonable technical and organizational measures (including encryption in transit, hashed passwords, and access controls) to protect your data. No method of transmission or storage is 100% secure.`
  ] },
  { h: "7. Your Choices", p: [
    `You may request access to, correction of, or deletion of your personal information by contacting ${COMPANY.email}. We will honor requests to the extent required by applicable law; some records must be retained for legal and accounting reasons.`
  ] },
  { h: "8. Children", p: [
    `Our services are for businesses and adults. We do not knowingly collect information from children under 13.`
  ] },
  { h: "9. Changes & Contact", p: [
    `We may update this Policy; material changes will be posted here with a new effective date. Contact us at ${COMPANY.email} · ${COMPANY.phone} · ${COMPANY.address}.`
  ] }
];

export { COMPANY as C, LEGAL_EFFECTIVE as L, PRIVACY as P, TERMS as T };
