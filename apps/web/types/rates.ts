export interface RateOffer {
  lender: string;
  rate: number;
  product: string;
  spread?: string;
  effective_date: string;
}

export interface RateBenchmark {
  lowest_rate: number;
  lowest_spread: string;
  leading_lender: string;
  product_family: string;
  effective_date: string;
  top_offers?: RateOffer[];
}

export interface RawRatesFeed {
  last_synced_utc: string;
  prime_rate_benchmark: number;
  rate_benchmarks: {
    '5_year_fixed_insured'?: RateBenchmark;
    '5_year_fixed_insurable'?: RateBenchmark;
    '5_year_fixed_conventional'?: RateBenchmark;
    '3_year_fixed_insured'?: RateBenchmark;
    '3_year_fixed_insurable'?: RateBenchmark;
    '3_year_fixed_conventional'?: RateBenchmark;
    '5_year_variable_insured'?: RateBenchmark;
    '5_year_variable_insurable'?: RateBenchmark;
    '5_year_variable_conventional'?: RateBenchmark;
    '3_year_variable'?: RateBenchmark;
    '2_year_fixed'?: RateBenchmark;
    '1_year_fixed'?: RateBenchmark;
    'heloc'?: RateBenchmark;
    'private_second'?: RateBenchmark;
    '5_year_fixed'?: RateBenchmark;
    '3_year_fixed'?: RateBenchmark;
    '5_year_variable'?: RateBenchmark;
    [key: string]: any;
  };
  recent_changelog?: Array<{
    timestamp: string;
    action: string;
    lender: string;
    details: string;
  }>;
}

export interface RateCardItem {
  id: string;
  term: string;
  category: 'fixed' | 'variable' | 'heloc' | 'private';
  structure: string; // e.g. "Insured (<20% Down)", "Insurable", "Conventional"
  rate: number;
  startingRate: string; // "From 4.44%"
  spreadFormula: string; // "Prime - 1.01%" or "Fixed"
  leadingLender: string;
  effectiveDate: string;
  badge?: string;
  featured?: boolean;
}

export interface RatesApiResponse {
  success: boolean;
  source: string;
  last_synced_utc: string;
  last_updated_human: string;
  is_today: boolean;
  prime_rate: number;
  benchmarks: {
    fixed_5yr: {
      insured: RateBenchmark;
      insurable: RateBenchmark;
      conventional: RateBenchmark;
      lowest: number;
    };
    fixed_3yr: {
      insured: RateBenchmark;
      insurable: RateBenchmark;
      conventional: RateBenchmark;
      lowest: number;
    };
    variable_5yr: {
      insured: RateBenchmark;
      insurable: RateBenchmark;
      conventional: RateBenchmark;
      lowest: number;
    };
    heloc: RateBenchmark;
    private_second: RateBenchmark;
    fixed_2yr?: RateBenchmark;
    fixed_1yr?: RateBenchmark;
    variable_3yr?: RateBenchmark;
  };
  featured_rates: RateCardItem[];
  all_rates: RateCardItem[];
}
