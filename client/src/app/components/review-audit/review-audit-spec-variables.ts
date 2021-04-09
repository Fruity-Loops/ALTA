export class ReviewAuditSpecVariables {
    public static auditId = 4;
    public static skToAssign = 3;
    public static customUser = {first_name: 'system', last_name: 'admin', email: 'sa@test.com', role: 'SA', is_active: true, id: 1, location: null, organization: null, user_name: 'sa'}
    public static assignedSKaudit = {
        'audit_id': ReviewAuditSpecVariables.auditId,
        'initiated_on': '2021-02-04T21:57:00.012000Z',
        'last_modified_on': '2021-04-08T00:17:54.142381Z',
        'accuracy': 100.0,
        'status': 'Active',
        'organization': 1,
        'initiated_by': 2,
        'template_id': null,
        'inventory_items': ['12731370', '12752843'],
        'assigned_sk': [ReviewAuditSpecVariables.skToAssign]
    };
    public static returnedBins = [{
        bin_id: 11,
        customuser: {
            id: 3,
            first_name: "stock",
            last_name: "keeper",
            user_name: "sk",
            location: "Florida"
        },
        init_audit: {
            audit_id: ReviewAuditSpecVariables.auditId,
            initiated_on: "2021-04-08T04:15:14.444000Z",
            last_modified_on: "2021-04-08T04:15:21.265000Z",
            accuracy: 0,
            status: "Pending",
            organization: 1,
            initiated_by: 2,
            template_id: null,
            inventory_items: [
                "12731370",
                "12752843"
            ],
            assigned_sk: [
                3
            ]
        },
        Bin: "C69",
        item_ids: "['12731370']",
        accuracy: 0,
        status: "Pending"
      },
      {
        bin_id: 12,
        customuser: {
            id: 3,
            first_name: "stock",
            last_name: "keeper",
            user_name: "sk",
            location: "Florida"
        },
        init_audit: {
            audit_id: ReviewAuditSpecVariables.auditId,
            initiated_on: "2021-04-08T04:15:14.444000Z",
            last_modified_on: "2021-04-08T04:15:21.265000Z",
            accuracy: 0,
            status: "Pending",
            organization: 1,
            initiated_by: 2,
            template_id: null,
            inventory_items: [
                "12731370",
                "12752843"
            ],
            assigned_sk: [
                3
            ]
        },
        Bin: "C20",
        item_ids: "['12752843']",
        accuracy: 0,
        status: "Pending"
    }];
}