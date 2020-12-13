export interface AuditTemplate {
    title: string;
    location: string;
    plant: string;
    zones: Array<string>;
    aisles: Array<number>;
    bins: Array<number>;
    part_number: string;
    serial_number: string;
    description: string;
}
