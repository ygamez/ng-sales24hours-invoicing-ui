export class StripeBalance {
  object:           string;
  availables:        Available[];
  connect_reserved: ConnectReserved[];
  livemode:         boolean;
  pendings:          Available[];
}

export class Available {
  amount:       number;
  currency:     string;
  source_types: SourceTypes;
}

export class SourceTypes {
  card: number;
}

export class ConnectReserved {
  amount:   number;
  currency: string;
}
