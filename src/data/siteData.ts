// Site-wide data for PsyComply

export interface Service {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  whoNeeds: string;
  whatsIncluded: string;
  icon: string;
  tiers: { name: string; description: string; price: string }[];
}

export interface StateInfo {
  slug: string;
  name: string;
  active: boolean;
  substances: string[];
  overview: string;
  licensingInfo: string;
}

export interface SubstanceInfo {
  slug: string;
  name: string;
  legalStatus: string;
  states: string[];
  clinicalRequirements: string;
  description: string;
}

export interface Asset {
  slug: string;
  title: string;
  category: string;
  state: string;
  substance: string;
  price: number;
  description: string;
  whyYouNeed: string;
  format: string;
  isBundle?: boolean;
  bundleContents?: string;
  bundleValue?: number;
}

export const services: Service[] = [
  {
    slug: "legal-compliance",
    title: "Legal & Compliance",
    shortDescription: "State licensing, regulatory filings, informed consent, and legal documentation for your psychedelic practice.",
    fullDescription: "From initial state licensing applications to ongoing regulatory filings, we handle every legal and compliance requirement for your psychedelic business. This includes informed consent templates, liability frameworks, regulatory correspondence, and compliance audits.",
    whoNeeds: "Any practice or clinic operating in a regulated psychedelic market. If you're accepting clients for psychedelic-assisted sessions, you need proper legal and compliance infrastructure from day one.",
    whatsIncluded: "State licensing applications and renewals. Informed consent documentation customized to your substance and jurisdiction. Regulatory filing templates and submission support. Compliance audit preparation. Legal risk assessment for your specific operational model.",
    icon: "Scale",
    tiers: [
      { name: "DIY", description: "Purchase individual legal templates from our asset library", price: "From $49" },
      { name: "Done With You", description: "We guide you through the legal setup with consulting calls and document reviews", price: "From $1,500" },
      { name: "Done For You", description: "We handle every legal filing, document, and compliance requirement", price: "Custom quote" },
    ],
  },
  {
    slug: "clinical-operations",
    title: "Clinical Operations",
    shortDescription: "Patient intake, session protocols, documentation systems, and clinical workflow design.",
    fullDescription: "Your clinical operations are the backbone of your practice. We build the intake processes, session protocols, documentation systems, and clinical workflows that keep your practice running smoothly and safely. Every protocol is designed for your specific substance and state requirements.",
    whoNeeds: "Facilitators and clinicians running psychedelic-assisted therapy sessions. Whether you're a solo practitioner or a multi-provider clinic, your clinical operations need to be airtight.",
    whatsIncluded: "Patient intake forms and screening protocols. Session documentation templates. Clinical workflow design and SOPs. Adverse event reporting procedures. Follow-up and integration session frameworks. Quality assurance systems.",
    icon: "Heart",
    tiers: [
      { name: "DIY", description: "Clinical templates and protocol documents from our library", price: "From $39" },
      { name: "Done With You", description: "Consulting sessions to build your clinical operation together", price: "From $2,000" },
      { name: "Done For You", description: "We design and document your entire clinical operation", price: "Custom quote" },
    ],
  },
  {
    slug: "controlled-substance-management",
    title: "Controlled Substance Management",
    shortDescription: "DEA compliance, inventory tracking, storage protocols, and chain-of-custody documentation.",
    fullDescription: "Handling controlled substances comes with serious federal and state requirements. We set up your inventory tracking systems, storage protocols, chain-of-custody documentation, and DEA compliance procedures so nothing falls through the cracks.",
    whoNeeds: "Any business handling scheduled or controlled psychedelic substances. Ketamine clinics, psilocybin service centers, and research facilities all need rigorous substance management protocols.",
    whatsIncluded: "DEA registration support and compliance documentation. Inventory tracking systems and logs. Secure storage protocols and facility requirements. Chain-of-custody documentation. Waste disposal and destruction procedures. Audit preparation for substance management.",
    icon: "Lock",
    tiers: [
      { name: "DIY", description: "Substance management templates and tracking logs", price: "From $59" },
      { name: "Done With You", description: "We help you set up your substance management systems", price: "From $2,500" },
      { name: "Done For You", description: "Complete substance management infrastructure built for you", price: "Custom quote" },
    ],
  },
  {
    slug: "staff-hr-compliance",
    title: "Staff & HR Compliance",
    shortDescription: "Hiring protocols, credential verification, training programs, and workplace policies.",
    fullDescription: "Your team needs proper onboarding, credential verification, and ongoing training to meet regulatory standards. We create your HR compliance infrastructure, from hiring checklists to continuing education tracking, so your staff is always qualified and current.",
    whoNeeds: "Clinics and practices hiring facilitators, therapists, administrative staff, or medical directors. If anyone works for you, you need HR compliance.",
    whatsIncluded: "Hiring and credentialing checklists. Background check requirements by state. Staff training program design. Employee handbook templates for psychedelic businesses. Continuing education tracking. Workplace safety and incident reporting procedures.",
    icon: "Users",
    tiers: [
      { name: "DIY", description: "HR templates, handbooks, and training checklists", price: "From $39" },
      { name: "Done With You", description: "We review and build your HR compliance with you", price: "From $1,200" },
      { name: "Done For You", description: "Full HR compliance setup for your organization", price: "Custom quote" },
    ],
  },
  {
    slug: "business-administration",
    title: "Business Administration",
    shortDescription: "Business entity setup, insurance guidance, financial compliance, and operational systems.",
    fullDescription: "The business side of a psychedelic practice involves entity structuring, insurance requirements, financial compliance, and day-to-day operational systems. We handle the administrative foundation so your business runs like a real business from day one.",
    whoNeeds: "Operators and investors launching new psychedelic businesses. Solo practitioners transitioning from informal practice to a legitimate business entity. Anyone who wants their back office in order.",
    whatsIncluded: "Business entity structuring guidance. Insurance requirements and provider recommendations. Financial record-keeping systems. Operational SOPs for daily business management. Vendor and contractor agreement templates. Business continuity and risk planning.",
    icon: "Building",
    tiers: [
      { name: "DIY", description: "Business administration templates and guides", price: "From $49" },
      { name: "Done With You", description: "Consulting to structure and set up your business operations", price: "From $1,800" },
      { name: "Done For You", description: "Complete business administration setup", price: "Custom quote" },
    ],
  },
  {
    slug: "marketing-branding-compliance",
    title: "Marketing & Branding Compliance",
    shortDescription: "Compliant marketing guidelines, advertising restrictions, and brand communication frameworks.",
    fullDescription: "Marketing a psychedelic business comes with real restrictions. Health claims, advertising rules, and platform-specific policies all create landmines for businesses that don't know the rules. We build your marketing compliance framework so you can promote your services without legal risk.",
    whoNeeds: "Any psychedelic business with a website, social media presence, or marketing materials. If you're talking to the public about your services, you need to know what you can and can't say.",
    whatsIncluded: "Marketing compliance guidelines for your state and substance. Advertising restriction summaries by platform. Website content compliance review. Social media policy templates. Health claims do's and don'ts. Brand messaging frameworks that stay compliant.",
    icon: "Megaphone",
    tiers: [
      { name: "DIY", description: "Marketing compliance guides and policy templates", price: "From $29" },
      { name: "Done With You", description: "We review your marketing materials and build guidelines together", price: "From $1,000" },
      { name: "Done For You", description: "Complete marketing compliance overhaul and ongoing review", price: "Custom quote" },
    ],
  },
];

export const states: StateInfo[] = [
  {
    slug: "oregon",
    name: "Oregon",
    active: true,
    substances: ["Psilocybin"],
    overview: "Oregon became the first state to legalize psilocybin-assisted therapy through Measure 109, passed in November 2020. The Oregon Psilocybin Services program, administered by the Oregon Health Authority, establishes a regulatory framework for licensed service centers, facilitators, and manufacturers. The program launched client services in mid-2023, creating a first-of-its-kind regulated psilocybin market.",
    licensingInfo: "Oregon requires separate licenses for service centers, facilitators, manufacturers, and testing laboratories. Each license type has specific requirements around training, facility standards, and operational protocols. The Oregon Psilocybin Advisory Board continues to refine rules as the program matures.",
  },
  {
    slug: "colorado",
    name: "Colorado",
    active: true,
    substances: ["Psilocybin", "DMT", "Ibogaine", "Mescaline"],
    overview: "Colorado passed Proposition 122 (the Natural Medicine Health Act) in November 2022, decriminalizing several natural psychedelic substances and establishing a framework for regulated access. The Colorado Department of Regulatory Agencies is developing the licensing and regulatory infrastructure, with the regulated market expected to begin phased rollout. Colorado's approach covers a broader set of substances than Oregon's psilocybin-only model.",
    licensingInfo: "Colorado's regulatory framework is still being developed, with the state establishing rules for healing centers, facilitators, and cultivation. The phased approach means different substances will become available at different times. Early compliance preparation gives businesses a significant advantage.",
  },
  { slug: "california", name: "California", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "washington", name: "Washington", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "new-york", name: "New York", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "texas", name: "Texas", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "florida", name: "Florida", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "michigan", name: "Michigan", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "massachusetts", name: "Massachusetts", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "arizona", name: "Arizona", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "minnesota", name: "Minnesota", active: false, substances: [], overview: "", licensingInfo: "" },
  { slug: "connecticut", name: "Connecticut", active: false, substances: [], overview: "", licensingInfo: "" },
];

export const substances: SubstanceInfo[] = [
  {
    slug: "psilocybin",
    name: "Psilocybin",
    legalStatus: "Legal for supervised use in Oregon. Regulated framework under development in Colorado. Remains Schedule I at the federal level, though several states and cities have decriminalized possession.",
    states: ["Oregon", "Colorado"],
    clinicalRequirements: "Psilocybin service centers must maintain specific facility standards, session protocols, and documentation requirements. Facilitators need state-approved training. Client screening, preparation sessions, administration protocols, and integration support all have regulatory requirements that vary by state.",
    description: "Psilocybin, the active compound in certain mushrooms, is at the forefront of psychedelic medicine regulation. Oregon's Measure 109 created the first legal framework for psilocybin-assisted therapy in 2023, and Colorado's Proposition 122 is building a broader natural medicine program that includes psilocybin.",
  },
  {
    slug: "ketamine",
    name: "Ketamine",
    legalStatus: "FDA-approved as an anesthetic. Esketamine (Spravato) is FDA-approved for treatment-resistant depression. Off-label use for mental health treatment is legal but subject to medical practice regulations and DEA scheduling requirements.",
    states: ["All states (medical practice regulations apply)"],
    clinicalRequirements: "Ketamine clinics must comply with DEA registration, controlled substance management protocols, medical supervision requirements, and state medical board regulations. Proper informed consent, patient screening, and adverse event protocols are essential. Insurance billing, if applicable, has its own compliance layer.",
    description: "Ketamine occupies a unique position in psychedelic medicine as a legal, FDA-approved substance used off-label for mental health treatment. Ketamine clinics operate across all 50 states under existing medical practice laws, but the compliance requirements are substantial and frequently misunderstood.",
  },
  {
    slug: "mdma",
    name: "MDMA",
    legalStatus: "Currently Schedule I at the federal level. FDA has reviewed MDMA-assisted therapy for PTSD through breakthrough therapy designation. Regulatory status is evolving, with potential rescheduling or approval on the horizon.",
    states: ["Federal regulatory pathway"],
    clinicalRequirements: "MDMA-assisted therapy protocols are being developed through clinical trial frameworks. When regulatory approval comes, practitioners will need training programs, clinical protocols, and compliance infrastructure specific to MDMA's pharmacological profile and therapeutic approach.",
    description: "MDMA-assisted therapy represents one of the most promising frontiers in psychedelic medicine, particularly for PTSD treatment. While FDA approval and rescheduling timelines remain in flux, smart operators are preparing their compliance infrastructure now.",
  },
  {
    slug: "ibogaine",
    name: "Ibogaine",
    legalStatus: "Schedule I at the federal level. Included in Colorado's Natural Medicine Health Act. Not FDA-approved for any indication. Some practitioners operate in international settings where ibogaine is legal or unscheduled.",
    states: ["Colorado (upcoming regulated framework)"],
    clinicalRequirements: "Ibogaine presents unique clinical safety considerations due to its cardiac effects and extended duration of action. Medical screening, cardiac monitoring protocols, and extended observation periods are essential components of any ibogaine program. Compliance requirements will be substantial once Colorado's regulatory framework is finalized.",
    description: "Ibogaine is a naturally occurring psychoactive substance with significant potential for addiction treatment. Its inclusion in Colorado's Natural Medicine Health Act signals growing regulatory interest, though the substance's unique safety profile means compliance requirements will be particularly detailed.",
  },
];

export const assets: Asset[] = [
  {
    slug: "oregon-psilocybin-informed-consent",
    title: "Oregon Psilocybin Informed Consent Template",
    category: "Legal",
    state: "Oregon",
    substance: "Psilocybin",
    price: 79,
    description: "A comprehensive informed consent template built specifically for Oregon psilocybin service centers. Covers all OHA-required disclosure elements, risk communication, and client acknowledgments.",
    whyYouNeed: "Oregon's psilocybin program requires specific informed consent elements that generic templates don't cover. This document is built from the actual regulatory requirements and updated as rules change.",
    format: "Word document (.docx), 8 pages",
  },
  {
    slug: "ketamine-patient-intake",
    title: "Ketamine Clinic Patient Intake Form",
    category: "Clinical",
    state: "All States",
    substance: "Ketamine",
    price: 49,
    description: "A thorough patient intake form designed for ketamine clinics. Includes medical history screening, contraindication checks, mental health assessment sections, and medication interaction review.",
    whyYouNeed: "Proper patient screening is your first line of defense against adverse events and liability. This form captures everything a responsible ketamine practice needs before a first session.",
    format: "Word document (.docx), 6 pages",
  },
  {
    slug: "facilitator-background-check-guide",
    title: "Facilitator Background Check Requirements Guide",
    category: "HR",
    state: "Oregon",
    substance: "Psilocybin",
    price: 39,
    description: "A clear guide to background check requirements for psilocybin facilitators in Oregon, including what disqualifies applicants, how to run compliant checks, and documentation requirements.",
    whyYouNeed: "Hiring a facilitator who doesn't pass the background check requirements puts your entire license at risk. This guide tells you exactly what to look for and how to document it.",
    format: "PDF, 12 pages",
  },
  {
    slug: "adverse-event-reporting-template",
    title: "Adverse Event Reporting Template",
    category: "Clinical",
    state: "All States",
    substance: "All",
    price: 59,
    description: "A structured adverse event reporting template that covers documentation, notification procedures, follow-up protocols, and regulatory reporting requirements for psychedelic-assisted sessions.",
    whyYouNeed: "When something goes wrong in a session, you need a clear process. This template makes sure you document everything correctly and notify the right parties within required timeframes.",
    format: "Word document (.docx), 5 pages",
  },
  {
    slug: "controlled-substance-inventory-log",
    title: "Controlled Substance Inventory Log",
    category: "Controlled Substances",
    state: "All States",
    substance: "Ketamine",
    price: 39,
    description: "A DEA-compliant inventory tracking log for controlled substances. Includes receipt logging, dispensation records, waste documentation, and reconciliation templates.",
    whyYouNeed: "DEA audits happen. When they do, your inventory records need to be perfect. This log system makes daily tracking straightforward and audit-ready.",
    format: "Excel spreadsheet (.xlsx) + PDF instructions, 4 pages",
  },
  {
    slug: "marketing-compliance-checklist",
    title: "Marketing Compliance Checklist",
    category: "Marketing",
    state: "All States",
    substance: "All",
    price: 29,
    description: "A comprehensive checklist for reviewing your marketing materials against psychedelic industry advertising restrictions. Covers health claims, platform rules, and state-specific guidelines.",
    whyYouNeed: "One bad health claim on your website or social media can trigger regulatory action. This checklist helps you catch problems before they become problems.",
    format: "PDF, 8 pages",
  },
  {
    slug: "oregon-psilocybin-clinic-bundle",
    title: "Oregon Psilocybin Clinic Launch Bundle",
    category: "Legal",
    state: "Oregon",
    substance: "Psilocybin",
    price: 349,
    description: "Everything you need to launch an Oregon psilocybin service center. Includes informed consent, intake forms, session protocols, adverse event reporting, staff requirements, and compliance checklists.",
    whyYouNeed: "Buying documents one at a time is expensive and you'll miss things. This bundle covers the full compliance foundation for an Oregon psilocybin practice at a significant discount.",
    format: "Multiple formats (.docx, .pdf, .xlsx), 40+ pages total",
    isBundle: true,
    bundleContents: "Includes: Informed Consent Template, Patient Intake Form, Session Protocol Template, Adverse Event Reporting Template, Facilitator Requirements Guide, Compliance Audit Checklist, and 4 additional documents.",
    bundleValue: 520,
  },
  {
    slug: "ketamine-clinic-starter-pack",
    title: "Ketamine Clinic Starter Pack",
    category: "Clinical",
    state: "All States",
    substance: "Ketamine",
    price: 299,
    description: "A complete document package for launching a ketamine clinic. Covers patient intake, controlled substance management, clinical protocols, HR requirements, and marketing compliance.",
    whyYouNeed: "Starting a ketamine clinic means navigating medical practice regulations, DEA requirements, and clinical protocol standards simultaneously. This bundle gives you the documentation foundation for all of it.",
    format: "Multiple formats (.docx, .pdf, .xlsx), 35+ pages total",
    isBundle: true,
    bundleContents: "Includes: Patient Intake Form, Controlled Substance Inventory Log, Session Documentation Template, Staff Credentialing Checklist, Marketing Compliance Guide, and 3 additional documents.",
    bundleValue: 420,
  },
];

export const testimonials = [
  {
    quote: "PsyComply gave us everything we needed to open our doors with confidence. The compliance piece was the part we dreaded most, and they just handled it.",
    role: "Psilocybin Service Center Owner, Oregon",
  },
  {
    quote: "We were spending so much time trying to figure out the regulatory requirements ourselves. Having someone who actually knows this space saved us months.",
    role: "Ketamine Clinic Director, Colorado",
  },
  {
    quote: "The asset library alone was worth it. We bought the Oregon bundle and had our documentation foundation ready in a weekend.",
    role: "Psilocybin Facilitator, Oregon",
  },
];
