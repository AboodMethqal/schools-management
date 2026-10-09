export interface Notice {
    id: string;
    title: string;
    date: string;
    description: string;
    category?: 'Academic' | 'Administrative' | 'Event' | 'Holiday';
    details?: Record<string, string>;
}
