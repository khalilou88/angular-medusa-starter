import {
  MoneyAmount,
  Product,
  ProductCollection,
  ProductTag,
  ProductType,
  ProductVariant,
} from './product.model';

export interface Cart {
  id: string;
  email?: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_address_id?: string;
  shipping_address?: Address;
  items: LineItem[];
  region_id: string;
  region: Region;
  discounts: Discount[];
  gift_cards: GiftCard[];
  customer_id?: string;
  payment_session?: PaymentSession;
  payment_sessions: PaymentSession[];
  payment_id?: string;
  shipping_methods: ShippingMethod[];
  type: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  subtotal: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  gift_card_total: number;
  total: number;
}

export interface LineItem {
  id: string;
  cart_id: string;
  order_id?: string;
  swap_id?: string;
  claim_order_id?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id?: string;
  variant: ProductVariant;
  quantity: number;
  fulfilled_quantity?: number;
  returned_quantity?: number;
  swap_line_item_id?: string;
  claim_line_item_id?: string;
  tax_lines: LineItemTaxLine[];
  adjustments: LineItemAdjustment[];
  created_at: string;
  updated_at: string;
  subtotal: number;
  tax_total: number;
  total: number;
}

export interface Address {
  id: string;
  customer_id?: string;
  company?: string;
  first_name?: string;
  last_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  country_code?: string;
  country?: Country;
  province?: string;
  postal_code?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Region {
  id: string;
  name: string;
  currency_code: string;
  currency: Currency;
  tax_rate: number;
  tax_rates: TaxRate[];
  tax_code?: string;
  gift_cards_taxable: boolean;
  automatic_taxes: boolean;
  countries: Country[];
  payment_providers: PaymentProvider[];
  fulfillment_providers: FulfillmentProvider[];
  includes_tax: boolean;
  created_at: string;
  updated_at: string;
}

export interface Currency {
  code: string;
  symbol: string;
  symbol_native: string;
  name: string;
}

export interface Country {
  id: number;
  iso_2: string;
  iso_3: string;
  num_code: number;
  name: string;
  display_name: string;
  region_id?: string;
}

export interface TaxRate {
  id: string;
  rate?: number;
  code?: string;
  name: string;
  region_id: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentProvider {
  id: string;
  is_installed: boolean;
}

export interface FulfillmentProvider {
  id: string;
  is_installed: boolean;
}

export interface Discount {
  id: string;
  code: string;
  is_dynamic: boolean;
  rule: DiscountRule;
  is_disabled: boolean;
  parent_discount_id?: string;
  starts_at: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DiscountRule {
  id: string;
  description?: string;
  type: string;
  value: number;
  allocation?: string;
  conditions: DiscountCondition[];
  created_at: string;
  updated_at: string;
}

export interface DiscountCondition {
  id: string;
  type: string;
  operator: string;
  discount_rule_id: string;
  products?: Product[];
  product_types?: ProductType[];
  product_tags?: ProductTag[];
  product_collections?: ProductCollection[];
  customer_groups?: CustomerGroup[];
  created_at: string;
  updated_at: string;
}

export interface CustomerGroup {
  id: string;
  name: string;
  customers?: Customer[];
  price_lists?: PriceList[];
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_addresses?: Address[];
  phone?: string;
  has_account: boolean;
  orders?: Order[];
  groups?: CustomerGroup[];
  created_at: string;
  updated_at: string;
}

export interface GiftCard {
  id: string;
  code: string;
  value: number;
  balance: number;
  region_id: string;
  region: Region;
  order_id?: string;
  order?: Order;
  is_disabled: boolean;
  ends_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentSession {
  id: string;
  cart_id: string;
  provider_id: string;
  is_selected: boolean;
  is_initiated: boolean;
  status: string;
  data: any;
  idempotency_key?: string;
  amount: number;
  payment_authorized_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ShippingMethod {
  id: string;
  shipping_option_id: string;
  order_id?: string;
  cart_id?: string;
  swap_id?: string;
  return_id?: string;
  claim_order_id?: string;
  shipping_option: ShippingOption;
  tax_lines: ShippingMethodTaxLine[];
  price: number;
  data: any;
  includes_tax: boolean;
  subtotal: number;
  total: number;
  tax_total: number;
}

export interface ShippingOption {
  id: string;
  name: string;
  region_id: string;
  profile_id: string;
  provider_id: string;
  price_type: string;
  amount?: number;
  is_return: boolean;
  admin_only: boolean;
  requirements: ShippingOptionRequirement[];
  data: any;
  includes_tax: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShippingOptionRequirement {
  id: string;
  shipping_option_id: string;
  type: string;
  amount: number;
  deleted_at?: string;
}

export interface LineItemTaxLine {
  id: string;
  rate: number;
  name: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface LineItemAdjustment {
  id: string;
  item_id: string;
  description: string;
  discount_id?: string;
  amount: number;
  metadata?: any;
}

export interface ShippingMethodTaxLine {
  id: string;
  rate: number;
  name: string;
  code?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  cart_id?: string;
  cart?: Cart;
  customer_id: string;
  customer: Customer;
  email: string;
  billing_address_id?: string;
  billing_address?: Address;
  shipping_address_id?: string;
  shipping_address?: Address;
  region_id: string;
  region: Region;
  currency_code: string;
  currency: Currency;
  tax_rate?: number;
  discounts: Discount[];
  gift_cards: GiftCard[];
  shipping_methods: ShippingMethod[];
  payments: Payment[];
  fulfillments: Fulfillment[];
  returns: Return[];
  claims: ClaimOrder[];
  refunds: Refund[];
  swaps: Swap[];
  draft_order_id?: string;
  draft_order?: DraftOrder;
  items: LineItem[];
  edits: OrderEdit[];
  gift_card_transactions: GiftCardTransaction[];
  canceled_at?: string;
  no_notification?: boolean;
  idempotency_key?: string;
  external_id?: string;
  sales_channel_id?: string;
  sales_channel?: SalesChannel;
  shipping_total: number;
  discount_total: number;
  tax_total: number;
  refunded_total: number;
  total: number;
  subtotal: number;
  paid_total: number;
  refundable_amount: number;
  gift_card_total: number;
  gift_card_tax_total: number;
  returnable_items?: LineItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  swap_id?: string;
  cart_id?: string;
  order_id?: string;
  amount: number;
  currency_code: string;
  amount_refunded: number;
  provider_id: string;
  data: any;
  captured_at?: string;
  canceled_at?: string;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Fulfillment {
  id: string;
  claim_order_id?: string;
  swap_id?: string;
  order_id?: string;
  provider_id: string;
  location_id?: string;
  shipped_at?: string;
  canceled_at?: string;
  data: any;
  metadata?: any;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Return {
  id: string;
  status: string;
  items: ReturnItem[];
  swap_id?: string;
  claim_order_id?: string;
  order_id?: string;
  shipping_method?: ShippingMethod;
  shipping_data?: any;
  location_id?: string;
  refund_amount: number;
  no_notification?: boolean;
  idempotency_key?: string;
  received_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReturnItem {
  id: string;
  return_id: string;
  item_id: string;
  item: LineItem;
  quantity: number;
  is_requested: boolean;
  requested_quantity?: number;
  received_quantity?: number;
  reason_id?: string;
  reason?: ReturnReason;
  note?: string;
  metadata?: any;
}

export interface ReturnReason {
  id: string;
  value: string;
  label: string;
  description?: string;
  parent_return_reason_id?: string;
  parent_return_reason?: ReturnReason;
  return_reason_children?: ReturnReason[];
  created_at: string;
  updated_at: string;
}

export interface ClaimOrder {
  id: string;
  payment_status: string;
  fulfillment_status: string;
  type: string;
  order_id: string;
  order: Order;
  return_order?: Return;
  shipping_address_id?: string;
  shipping_address?: Address;
  shipping_methods: ShippingMethod[];
  fulfillments: Fulfillment[];
  claim_items: ClaimItem[];
  additional_items: LineItem[];
  created_at: string;
  updated_at: string;
}

export interface ClaimItem {
  id: string;
  images: ClaimImage[];
  claim_order_id: string;
  item_id: string;
  item: LineItem;
  variant_id: string;
  variant: ProductVariant;
  reason: string;
  note?: string;
  quantity: number;
  tags: ClaimTag[];
  created_at: string;
  updated_at: string;
}

export interface ClaimImage {
  id: string;
  claim_item_id: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface ClaimTag {
  id: string;
  value: string;
  created_at: string;
  updated_at: string;
}

export interface Refund {
  id: string;
  order_id?: string;
  amount: number;
  note?: string;
  reason: string;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Swap {
  id: string;
  fulfillment_status: string;
  payment_status: string;
  order_id: string;
  order: Order;
  additional_items: LineItem[];
  return_order: Return;
  fulfillments: Fulfillment[];
  payment?: Payment;
  difference_due?: number;
  shipping_address_id?: string;
  shipping_address?: Address;
  shipping_methods: ShippingMethod[];
  cart_id?: string;
  cart?: Cart;
  confirmed_at?: string;
  canceled_at?: string;
  no_notification?: boolean;
  allow_backorder: boolean;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface DraftOrder {
  id: string;
  status: string;
  display_id: number;
  cart_id?: string;
  cart?: Cart;
  order_id?: string;
  order?: Order;
  canceled_at?: string;
  completed_at?: string;
  no_notification_order?: boolean;
  idempotency_key?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderEdit {
  id: string;
  order_id: string;
  order: Order;
  changes: OrderItemChange[];
  internal_note?: string;
  created_by: string;
  requested_by?: string;
  requested_at?: string;
  confirmed_by?: string;
  confirmed_at?: string;
  declined_by?: string;
  declined_reason?: string;
  declined_at?: string;
  canceled_by?: string;
  canceled_at?: string;
  subtotal: number;
  discount_total: number;
  shipping_total: number;
  gift_card_total: number;
  gift_card_tax_total: number;
  tax_total: number;
  total: number;
  difference_due: number;
  status: string;
  items: LineItem[];
  payment_collection_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemChange {
  id: string;
  order_edit_id: string;
  order_edit: OrderEdit;
  original_line_item_id?: string;
  original_line_item?: LineItem;
  line_item_id?: string;
  line_item?: LineItem;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface GiftCardTransaction {
  id: string;
  gift_card_id: string;
  gift_card: GiftCard;
  order_id: string;
  order: Order;
  amount: number;
  created_at: string;
}

export interface SalesChannel {
  id: string;
  name: string;
  description?: string;
  is_disabled: boolean;
  locations?: any[];
  created_at: string;
  updated_at: string;
}

export interface PriceList {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  starts_at?: string;
  ends_at?: string;
  customer_groups: CustomerGroup[];
  prices: MoneyAmount[];
  includes_tax: boolean;
  created_at: string;
  updated_at: string;
}
