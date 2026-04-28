export enum UserRole {
    ADMIN = 'admin',
    MANAGER = 'manager',
    CUSTOMER = 'customer',
}

export enum CourtType {
  FIVE_ASIDE = 'FIVE_ASIDE',
  SEVEN_ASIDE = 'SEVEN_ASIDE',
  FUTSAL = 'FUTSAL',
}

export enum SurfaceType {
  ARTIFICIAL_GRASS = 'ARTIFICIAL_GRASS',
  NATURAL_GRASS = 'NATURAL_GRASS',
  CONCRETE = 'CONCRETE',
  WOODEN = 'WOODEN',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export enum PaymentStatus {
  UNPAID = 'UNPAID',
  DEPOSIT_PAID = 'DEPOSIT_PAID',
  FULLY_PAID = 'FULLY_PAID',
  REFUNDED = 'REFUNDED',
}