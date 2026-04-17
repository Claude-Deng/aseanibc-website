import type { Schema, Struct } from '@strapi/strapi';

export interface AboutRegions extends Struct.ComponentSchema {
  collectionName: 'components_about_regions';
  info: {
    description: '\u8986\u76D6\u533A\u57DF';
    displayName: 'Region';
    icon: 'globe';
  };
  attributes: {
    cities: Schema.Attribute.Text;
    country: Schema.Attribute.String;
  };
}

export interface CaseCaseTypes extends Struct.ComponentSchema {
  collectionName: 'components_case_case_types';
  info: {
    description: '\u6848\u4F8B\u7C7B\u578B\u5361\u7247';
    displayName: 'Case Type';
    icon: 'book';
  };
  attributes: {
    icon: Schema.Attribute.Media<'images'>;
    linkSlug: Schema.Attribute.String;
    slogan: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface CaseIndustries extends Struct.ComponentSchema {
  collectionName: 'components_case_industries';
  info: {
    description: '\u884C\u4E1A\u7ECF\u9A8C\u5361\u7247';
    displayName: 'Industry';
    icon: 'industry';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    industry: Schema.Attribute.String;
  };
}

export interface ContactPartners extends Struct.ComponentSchema {
  collectionName: 'components_contact_partners';
  info: {
    description: '\u5408\u4F5C\u65B9\u540D\u79F0';
    displayName: 'Contact Partner';
    icon: 'partner';
  };
  attributes: {
    name: Schema.Attribute.String;
  };
}

export interface EventEventHighlightsCard extends Struct.ComponentSchema {
  collectionName: 'components_event_event_highlights_card';
  info: {
    description: '\u6838\u5FC3\u5356\u70B9/\u5A92\u4F53\u77E9\u9635/\u8BFE\u7A0B\u6A21\u5757\u7C7B\u5361\u7247';
    displayName: 'Event Highlights Card';
    icon: 'star';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    description: Schema.Attribute.String;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface EventEventLogisticsCard extends Struct.ComponentSchema {
  collectionName: 'components_event_event_logistics_card';
  info: {
    description: '\u884C\u7A0B/\u4F4F\u5BBF/\u4FDD\u969C\u7C7B\u5185\u5BB9\u5361\u7247';
    displayName: 'Event Logistics Card';
    icon: 'list';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface EventServicesOffered extends Struct.ComponentSchema {
  collectionName: 'components_event_services_offered';
  info: {
    description: '\u6D3B\u52A8\u63D0\u4F9B\u7684\u670D\u52A1\u9879';
    displayName: 'Event Service Offered';
    icon: 'handshake';
  };
  attributes: {
    content: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface HomeCoreValues extends Struct.ComponentSchema {
  collectionName: 'components_home_core_values';
  info: {
    description: '\u9996\u9875\u6838\u5FC3\u4EF7\u503C\u5361\u7247';
    displayName: 'Core Value';
    icon: 'star';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ServiceAdvantage extends Struct.ComponentSchema {
  collectionName: 'components_service_advantages';
  info: {
    description: '\u670D\u52A1\u4F18\u52BF\u5361\u7247';
    displayName: 'Advantage';
    icon: 'award';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface ServiceDetailItems extends Struct.ComponentSchema {
  collectionName: 'components_service_detail_items';
  info: {
    description: '\u670D\u52A1\u8BE6\u60C5\u5B50\u9879';
    displayName: 'Service Detail Item';
    icon: 'list';
  };
  attributes: {
    content: Schema.Attribute.RichText;
    title: Schema.Attribute.String;
  };
}

export interface TestimonialTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_testimonial_testimonials';
  info: {
    description: '\u5BA2\u6237\u8BC4\u4EF7\u7EC4\u4EF6';
    displayName: 'Testimonial';
    icon: 'quote';
  };
  attributes: {
    reviewContent: Schema.Attribute.RichText;
    reviewerAvatar: Schema.Attribute.Media<'images'>;
    reviewerName: Schema.Attribute.String;
    reviewerTitle: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'about.regions': AboutRegions;
      'case.case-types': CaseCaseTypes;
      'case.industries': CaseIndustries;
      'contact.partners': ContactPartners;
      'event.event-highlights-card': EventEventHighlightsCard;
      'event.event-logistics-card': EventEventLogisticsCard;
      'event.services-offered': EventServicesOffered;
      'home.core-values': HomeCoreValues;
      'service.advantage': ServiceAdvantage;
      'service.detail-items': ServiceDetailItems;
      'testimonial.testimonial': TestimonialTestimonial;
    }
  }
}
