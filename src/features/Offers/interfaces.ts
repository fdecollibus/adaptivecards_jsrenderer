/**
 * BFF API Response
 *
 * Based on OffersOverview class
 * Related to swagger.json "Insurance Proposal myAXA Offer API v1"
 *
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.OffersOverview
 *
 * @todo confirm optionality/nullability with real data
 * @todo unclear what comes as iconId (which icons table?)
 */
import { IconType } from '@components/Icon';
import { TypeOrNull } from '../../interfaces';

export interface OfferOverview {
  /**
   * mandatory, can have no entries (empty List)
   */
  offerGroups: OfferGroup[];
  /**
   * mandatory
   */
  partnerNumber: number;
  /**
   * optional, is not available when OfferGroup is empty
   */
  advisor: TypeOrNull<Advisor>;
}

/**
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.OfferGroup
 */
export interface OfferGroup {
  /**
   * mandatory
   */
  offers: Offer[];
  /**
   * Example: "Motorfahrzeugversicherung", "Reiseversicherung INTERTOURS"
   *
   * mandatory
   */
  productName: string;
  /**
   * Example: "ZH 123456", "TG 123456"
   *
   * mandatory
   */
  description: string | null;
  /**
   * mandatory
   */
  businessCd: string;
}

/**
 * BFF API Response of OfferGroup.offers[number]
 *
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.Offer
 */
export interface Offer {
  /**
   * Example: "e1cc3c2a-6ae1-4a1a-9235-1e345fd6a9af"
   * mandatory
   */
  uuid: string;
  /**
   * mandatory
   */
  iconId: number;
  businessCd: string;
  /**
   * Example: "Motorfahrzeugversicherung"
   *
   * Copy of parent OfferGroup.productName
   */
  productName: string;
  /**
   * Variant
   *
   * Example: "Test 1"
   */
  description: string | null;
  /**
   * Copy of parent OfferGroup.description
   */
  descriptionOfferGroup: string | null;
  /**
   * ISO date format
   *
   * Example: "2021-03-11T23:00:00.000Z"
   * mandatory
   */
  contractFrom: string;
  /**
   * ISO date format
   *
   * Example: "2021-03-11T23:00:00.000Z"
   */
  contractTo: string | null;
  /**
   * ISO date format
   *
   * Example: "2021-03-11T23:00:00.000Z"
   */
  offerFrom: string;
  /**
   * ISO date format
   *
   * Example: "2021-06-10T22:00:00.000Z"
   */
  offerTo: string;
  premium: {
    /**
     * Example: "CHF"
     * mandatory
     */
    currencyCode: string;
    /**
     * Example: 1718.18
     * mandatory
     */
    amount: number;
  };
  /**
   * mandatory
   */
  state: {
    /**
     * Options:
     * - '0' = Offen
     * - '1' = In bearbeitung
     * - '2' = Abgeschlossen
     *
     * mandatory
     *
     * @see OFFER_STATUS_KEY
     */
    key: string;
    /**
     * Options:
     * - 'offen'
     * - 'In bearbeitung'
     * - 'Abgeschlossen'
     *
     * mandatory
     */
    value: string;
  };
  /**
   * Whether this Offer is recommended or not
   *
   * mandatory
   */
  recommendation: boolean;
  /**
   * mandatory, can be empty
   */
  offerDocument: OfferDocument;
  /**
   * mandatory, can be empty
   */
  avbDocuments: AvbDocument[];
}

/**
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.OfferDocument
 */
export interface OfferDocument {
  /**
   * Example: "e1cc3c2a-6ae1-4a1a-9235-1e345fd6a9af"
   * mandatory
   */
  ecmDocId: string;
  title: string | null;
}

/**
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.AvbDocument
 */
export interface AvbDocument {
  /**
   * mandatory
   */
  pubDocId: TypeOrNull<number>;
  title: TypeOrNull<string>;
  /**
   * Example: "804e53a-eb1b-5f40-9d2a-2abb9b2cfc08"
   */
  // docStoreId: string;
}

/**
 * BFF API Response of OfferOverview.advisor
 *
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.Advisor
 */
export interface Advisor {
  /**
   * Example: "C323012"
   * optional
   */
  advisorId?: string;
  /**
   * Example: "Nico"
   * optional
   */
  firstName?: string;
  /**
   * Example: "Eigenmann"
   * optional
   */
  lastName?: string;
  /**
   * Example: "nico.eigenmann@axa.ch"
   * optional
   */
  mail?: string;
  /**
   * Example: "+41 58 215 25 37"
   * optional
   */
  phoneNumber?: string;
  /**
   * optional
   */
  mobileNumber?: string;
  /**
   * Example: "Zürcherstrasse 10"
   * optional
   */
  street?: string;
  /**
   * Example: "G4.153"
   * optional
   */
  postBox?: string;
  /**
   * Example: "8400"
   * optional
   */
  postalCode?: string;
  /**
   * Example: "Winterthur"
   * optional
   */
  city?: string;
  /**
   * optional
   */
  countryCode?: {
    /**
     * Example: "CH"
     * mandatory
     */
    key: string;
    /**
     * Example: "Schweiz"
     * mandatory
     */
    value: string;
  };
  /**
   * optional
   */
  genderCode?: {
    /**
     * Example: "m"
     * mandatory
     */
    key: string;
    /**
     * Example: "männlich"
     * mandatory
     */
    value: string;
  };
  /**
   * optional
   */
  advisorInformationDocument: AdvisorInformationDocument;
}

/**
 * @see com.axa.ch.presentation.model.partner.api.v1.model.offers.AdvisorInformationDocument
 */
export interface AdvisorInformationDocument {
  /**
   * mandatory
   */
  label: string;
  /**
   * mandatory
   */
  url: string;
}

/**
 * response for endpoint '/rest/pds-document/v1/documents/properties'
 * doc: https://pdsapi1-ecm-dev.axa-ch-dev-int.blue.medc.openpaas.axa-cloud.com/docu/swagger.html#!/PdsDocumentApi_1/searchProperties
 */
export interface AvbPropertiesResponse {
  list: AvbProperty[];
}

/**
 * doc: https://pdsapi1-ecm-dev.axa-ch-dev-int.blue.medc.openpaas.axa-cloud.com/docu/swagger.html#!/PdsDocumentApi_1/searchProperties
 */
export interface AvbProperty {
  uuid: TypeOrNull<string>;
  publknDokId: TypeOrNull<number>;
  publknDokRefNr: TypeOrNull<string>;
  publknDokTypCdoms: TypeOrNull<number>;
  dokTypCdoms: TypeOrNull<number>;
  publknDat: TypeOrNull<string>;
  rehtCdu: TypeOrNull<number>;
  geschBerCdecm: TypeOrNull<number>;
  gueltigAb: TypeOrNull<string>;
  gueltigBis: TypeOrNull<string>;
  infoVtrauktStufeCdu: TypeOrNull<number>;
  nameKomplErstr: TypeOrNull<string>;
  publknDokVwendgCdoms: TypeOrNull<number>;
  publknDokPartTypCdches: TypeOrNull<number[]>;
  vvbAusgbVsn: TypeOrNull<string>;
  vprodCdus: TypeOrNull<number[]>;
  dokArchvtAm: TypeOrNull<string>;
  prodFamCdmktgs: TypeOrNull<number[]>;
  publknDokZgrifCd: TypeOrNull<string>;
  spraCdiPublkn: TypeOrNull<string>;
  mimeTypBez: TypeOrNull<string>;
  mimeStypBez: TypeOrNull<string>;
  url: TypeOrNull<string>;
  kzPublknDokVorhd: TypeOrNull<boolean>;
  fileNameKompl: TypeOrNull<string>;
  mutnDat: TypeOrNull<string>;
  suchErgnsDokInfo: TypeOrNull<string>;
  suchErgnsRelvzBwrtg: TypeOrNull<number>;
  fileSize: TypeOrNull<number>;
  dokTypCdomsBez: TypeOrNull<string>;
  geschBerCdmktgs: TypeOrNull<number[]>;
  kdLVhltsCdches: TypeOrNull<number[]>;
  kdSegCdches: TypeOrNull<number[]>;
  publknDokAusgbMonat: TypeOrNull<string>;
  vkThemaCdmktgs: TypeOrNull<number[]>;
  wshftBerCdmktgs: TypeOrNull<number[]>;
  elvAvbBez: TypeOrNull<string>;
  elvProdlCdls: TypeOrNull<string[]>;
  elvTfGnrtnCdil: TypeOrNull<string>;
  vtrbKoopPartCdches: TypeOrNull<number>;
}

/* ref: package com.axa.ch.presentation.model.partner.api.v1.model.offers; */
export interface OfferConfirmation {
  emailCustomer: string | null;
}

/** our frontend interface for optimized Offer object that contains more information */
export interface OfferDetail extends Offer {
  isSelected: boolean;
  icon: IconType;
  formattedTitle: string;
}
