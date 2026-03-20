export interface Activity {
    id: number;
    title: string;
    short_description: string;
    full_description: string;
    image_url: string;
    day_of_week: string;
    max_participants: number;
    location: string;
    original_price: number;
    discount_price: number;
}

export interface Coach {
    id: number;
    name: string;
    slug: string;
    title: string;
    bio_short: string;
    bio_long?: string;
    credentials?: string;
    specialties: string;
    image_url: string;
    brand: string;
}

export interface Program {
    id: number;
    name: string;
    slug: string;
    summary: string;
    target_audience: string;
    duration_weeks: number;
    outcomes: string;
    min_participants: number;
    starting_price_note: string;
    weeks?: ProgramWeek[];
}

export interface ProgramWeek {
    id: number;
    program_id: number;
    month_number: number;
    week_number: number;
    title: string;
    short_description: string;
    inclusions: string;
    delivery_mode: string;
    is_optional: boolean;
}

export interface B2BClass {
    id: number;
    name: string;
    slug: string;
    category: string;
    intensity: string;
    description_short: string;
    description_long?: string;
    duration_minutes: number;
    max_pax: number;
    delivery_modes: string;
    locations: string;
    coach_id: number;
    coach_name?: string;
    coach_brand?: string;
    coach_bio?: string;
    suggested_retail_price: number;
    image_url?: string;
}

export interface Package {
    id: number;
    name: string;
    slug: string;
    program_id?: number | null;
    duration_weeks: number;
    description: string;
    starting_price_total: number;
    tier_label: string;
}
