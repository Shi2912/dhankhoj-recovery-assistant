/**
 * Claim Guidance and Dynamic Checklist Service
 * Generates tailored step-by-step instructions and document checklists
 * based on asset category, authority, and relationship (self vs deceased).
 */

export function generateClaimGuidance(record, relation = 'myself', isDeceased = false) {
  const assetType = record.assetType || 'Unclaimed Bank Deposit';
  const authority = record.claimAuthority || 'Relevant Financial Authority';
  const institution = record.institution || 'Financial Institution';
  const isFamilyClaim = relation !== 'myself' || isDeceased;

  // 5 Step Claim Journey
  const steps = [
    {
      stepNumber: 1,
      title: 'Verify the Record with the Branch/Authority',
      action: `Locate the branch or nodal officer of ${institution}. Quote the source reference or folio number to confirm that this unclaimed entry exists in their DEA/IEPF/EPFO registry.`,
      tip: 'Do not pay any agent fees. Official verification is free.'
    },
    {
      stepNumber: 2,
      title: 'Collect & Prepare Required Documents',
      action: 'Assemble your identification proofs, historical documents, and relation credentials as outlined in the checklist below.',
      tip: 'Ensure all photocopies are self-attested and clearly legible.'
    },
    {
      stepNumber: 3,
      title: 'Initiate the Claim with the Official Authority',
      action: getSubmissionAction(assetType, institution),
      tip: 'Only interact with verified bank branches or official government portals (.gov.in / .rbi.org.in).'
    },
    {
      stepNumber: 4,
      title: 'Complete KYC & Biometric/Physical Verification',
      action: 'Submit the completed claim form along with KYC documents and original certificates (or indemnity bond if original certificate is lost).',
      tip: 'Always obtain an official stamped acknowledgement or digital reference number.'
    },
    {
      stepNumber: 5,
      title: 'Track Claim Settlement & Direct Transfer',
      action: 'Track your claim progress using the reference number. Approved funds are transferred directly to your bank account via NEFT/RTGS, or shares credited to your Demat account.',
      tip: 'Government authorities never transfer funds via third-party wallets or demand OTPs.'
    }
  ];

  // Dynamic document checklist based on category
  const commonDocuments = [
    {
      id: 'doc-id',
      name: 'Valid Government Photo Identity Proof',
      description: 'Aadhaar Card, Passport, Voter ID, or PAN Card of the claimant',
      mandatory: true
    },
    {
      id: 'doc-address',
      name: 'Current Address Proof',
      description: 'Utility bill, Aadhaar, or Passport showing current residence',
      mandatory: true
    },
    {
      id: 'doc-bank',
      name: 'Bank Account Proof (Cancelled Cheque)',
      description: 'Original cancelled cheque or bank passbook copy for direct credit',
      mandatory: true
    }
  ];

  const categoryDocuments = [];
  if (assetType.includes('Deposit')) {
    categoryDocuments.push(
      {
        id: 'doc-passbook',
        name: 'Original Passbook / Term Deposit Receipt (if available)',
        description: 'Physical passbook or fixed deposit receipt. If lost, an affidavit/indemnity for lost instrument may be accepted.',
        mandatory: false
      },
      {
        id: 'doc-rbi-form',
        name: 'Bank Unclaimed Deposit Claim Form',
        description: 'Prescribed claim form (Form available on bank website or branch desk)',
        mandatory: true
      }
    );
  } else if (assetType.includes('Share') || assetType.includes('Dividend')) {
    categoryDocuments.push(
      {
        id: 'doc-iepf-5',
        name: 'IEPF Form IEPF-5 (e-Form)',
        description: 'Filled online on the MCA / IEPF Portal (www.iepf.gov.in) with SRN acknowledgement',
        mandatory: true
      },
      {
        id: 'doc-demat',
        name: 'Client Master List (CML) of Demat Account',
        description: 'Officially stamped by Depository Participant (NSDL/CDSL) where shares should be credited',
        mandatory: true
      },
      {
        id: 'doc-share-cert',
        name: 'Original Share Certificates / Dividend Warrants',
        description: 'Physical share certificates or Indemnity Bond (Form IEPF) if certificates are untraceable',
        mandatory: false
      }
    );
  } else if (assetType.includes('Provident') || assetType.includes('PF')) {
    categoryDocuments.push(
      {
        id: 'doc-epfo-form',
        name: 'EPFO Inoperative Account Helpdesk Claim / Form 19',
        description: 'Filled via Unified Member Portal (UAN) or physical joint declaration through employer',
        mandatory: true
      },
      {
        id: 'doc-uan-pan',
        name: 'UAN / PAN Card linking verification',
        description: 'PAN card copy linked to Aadhaar for TDS calculation on accumulated PF interest',
        mandatory: true
      }
    );
  }

  // Deceased-Holder / Legal Heir specific requirements
  const legalHeirDocuments = [];
  if (isFamilyClaim) {
    legalHeirDocuments.push(
      {
        id: 'doc-death-cert',
        name: 'Death Certificate of the Original Account Holder',
        description: 'Original or certified copy issued by Municipal Corporation or Registrar of Births & Deaths',
        mandatory: true
      },
      {
        id: 'doc-heir-cert',
        name: 'Legal Heir / Succession Certificate / Family Tree',
        description: 'Succession certificate issued by competent Civil Court, or Legal Heir Certificate from Revenue Authority (Tahsildar/DM)',
        mandatory: true
      },
      {
        id: 'doc-noc-heirs',
        name: 'No Objection Certificate (NOC) / Disclaimer',
        description: 'Affidavit and NOC on non-judicial stamp paper from other surviving legal heirs',
        mandatory: true
      },
      {
        id: 'doc-indemnity',
        name: 'Indemnity Bond & Surety',
        description: 'Standard indemnity bond indemnifying the bank/company against conflicting claims',
        mandatory: true
      }
    );
  }

  return {
    recordId: record.id,
    holderName: record.holderName,
    institution: record.institution,
    assetType,
    relation,
    isFamilyClaim,
    steps,
    checklists: {
      standardKyc: commonDocuments,
      categorySpecific: categoryDocuments,
      legalHeirSpecific: legalHeirDocuments
    },
    officialAuthority: authority,
    disclaimer: 'Documents commonly requested may include those listed above. Requirements vary by amount and institution. Please verify the exact checklist with the nodal authority.'
  };
}

function getSubmissionAction(assetType, institution) {
  if (assetType.includes('Deposit')) {
    return `Visit the nearest home branch of ${institution} or designated Nodal Branch handling DEA Fund claims with your claim packet.`;
  }
  if (assetType.includes('Share') || assetType.includes('Dividend')) {
    return 'File e-Form IEPF-5 on the Ministry of Corporate Affairs (MCA) portal, and courier the physical verification packet to the company Nodal Officer.';
  }
  return 'Submit an inoperative account claim via the EPFO Unified Member Portal or submit Form 10D/19 to the Regional PF Commissioner.';
}
