export class ManageAuditsSpecVariables {
    public static initiatedBy = 2;
    public static skToAssign = 3;
    public static auditId = 1;
    public static binId = 1;
    public static store = {};
    public static mockLocalStorage = {
        getItem: (key: string): string => {
        return key in ManageAuditsSpecVariables.store ? ManageAuditsSpecVariables.store[key] : null;
        },
        setItem: (key: string, value: string) => {
            ManageAuditsSpecVariables.store[key] = `${value}`;
        },
        removeItem: (key: string) => {
        delete ManageAuditsSpecVariables.store[key];
        },
        clear: () => {
            ManageAuditsSpecVariables.store = {};
        }
    };

    public static auditReturnInfo = {
        'audit_id': ManageAuditsSpecVariables.auditId,
        'initiated_on': '2021-04-07T22:31:34.833840Z',
        'last_modified_on': '2021-04-07T22:31:34.833858Z',
        'accuracy': 0.0,
        'status': 'Pending',
        'organization': 1,
        'initiated_by': ManageAuditsSpecVariables.initiatedBy,
        'template_id': null,
        'inventory_items': [{
            "Item_Id": "12731370",
            "Batch_Number": "12731370",
            "Location": "Florida",
            "Plant": "False",
            "Zone": "B",
            "Aisle": 3,
            "Bin": "C69",
            "Part_Number": "PART-4",
            "Part_Description": "Dummy Part 1",
            "Serial_Number": "SN-4",
            "Condition": "Serviceable",
            "Category": "SERIALIZED",
            "Owner": "FG",
            "Criticality": "High",
            "Average_Cost": " $9,000.00 ",
            "Quantity": 1,
            "Unit_of_Measure": "EA",
            "organization": 1
        },
        {
            "Item_Id": "12752843",
            "Batch_Number": "12752843",
            "Location": "Florida",
            "Plant": "True",
            "Zone": "B",
            "Aisle": 1,
            "Bin": "C20",
            "Part_Number": "PART-3",
            "Part_Description": "Dummy Part 2",
            "Serial_Number": "SN-4",
            "Condition": "Serviceable",
            "Category": "SERIALIZED",
            "Owner": "FG",
            "Criticality": "High",
            "Average_Cost": " $9,000.00 ",
            "Quantity": 1,
            "Unit_of_Measure": "EA",
            "organization": 1
        }
    ],
        'assigned_sk': []
    };

    public static edittedAudit = {
        'audit_id': ManageAuditsSpecVariables.auditId,
        'initiated_on': '2021-02-04T21:57:00.012000Z',
        'last_modified_on': '2021-04-08T00:17:54.142381Z',
        'accuracy': 100.0,
        'status': 'Active',
        'organization': 1,
        'initiated_by': ManageAuditsSpecVariables.initiatedBy,
        'template_id': null,
        'inventory_items': ['12731370', '12752843'],
        'assigned_sk': [1]
    };

    public static auditListing = [
        {audit_id: 1, inventory_items: ['12731370', '12752843'], assigned_sk: [3], initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
        {audit_id: 2, inventory_items: ['12731370', '12752843'], assigned_sk: [3], initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
        {audit_id: 4, inventory_items: ['12731370'], assigned_sk: [3], initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
        {audit_id: 7, inventory_items: ['12731370', '12752843'], assigned_sk: [3], initiated_on: "2021-02-04T21:57:00.012000Z", last_modified_on: null, organization: 1, status: "Active", template_id: null},
        {audit_id: 9, inventory_items: ['12731370', '12752843'], assigned_sk: [3], initiated_on: "2021-03-31T07:41:07.403000Z", last_modified_on: "2021-03-31T07:42:32.790000Z", organization: 1, status: "Active", template_id: null}
    ];

    public static busySKs = [
        {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        },
        {
            "id": 5,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk1000",
            "location": "YYZ"
        },
        {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        },
        {
            "id": 5,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk1000",
            "location": "YYZ"
        },
        {
            "id": 5,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk1000",
            "location": "YYZ"
        },
        {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        },
        {
            "id": 5,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk1000",
            "location": "YYZ"
        },
        {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        },
        {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        }
    ];

    public static formattedAudits = [
        {
          "audit_id": 1,
          "initiated_on": "04/02/2021",
          "status": "Active",
          "accuracy": 100,
          "initiated_by": "inventory manager",
          "location": "Florida",
          "bin": "Multiple"
        },
        {
          "audit_id": 6,
          "initiated_on": "04/02/2021",
          "status": "Active",
          "accuracy": 100,
          "initiated_by": "inventory manager",
          "location": "Florida",
          "bin": "C69"
        },
        {
          "audit_id": 9,
          "initiated_on": "31/03/2021",
          "status": "Active",
          "accuracy": 1,
          "initiated_by": "inventory manager",
          "location": "Florida",
          "bin": "Multiple"
        }
    ];

    public static returnableBin = {
        "bin_id": 8,
        "Bin": "C20",
        "item_ids": "['12752843']",
        "accuracy": 0,
        "status": "Pending",
        "init_audit": ManageAuditsSpecVariables.auditId,
        "customuser": ManageAuditsSpecVariables.skToAssign
    };

    public static returnedBins = [{
        "bin_id": 11,
        "customuser": {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        },
        "init_audit": {
            "audit_id": ManageAuditsSpecVariables.auditId,
            "initiated_on": "2021-04-08T04:15:14.444000Z",
            "last_modified_on": "2021-04-08T04:15:21.265000Z",
            "accuracy": 0,
            "status": "Pending",
            "organization": 1,
            "initiated_by": 2,
            "template_id": null,
            "inventory_items": [
                "12731370",
                "12752843"
            ],
            "assigned_sk": [
                3
            ]
        },
        "Bin": "C69",
        "item_ids": "['12731370']",
        "accuracy": 0,
        "status": "Pending"
      },
      {
        "bin_id": 12,
        "customuser": {
            "id": 3,
            "first_name": "stock",
            "last_name": "keeper",
            "user_name": "sk",
            "location": "Florida"
        },
        "init_audit": {
            "audit_id": ManageAuditsSpecVariables.auditId,
            "initiated_on": "2021-04-08T04:15:14.444000Z",
            "last_modified_on": "2021-04-08T04:15:21.265000Z",
            "accuracy": 0,
            "status": "Pending",
            "organization": 1,
            "initiated_by": 2,
            "template_id": null,
            "inventory_items": [
                "12731370",
                "12752843"
            ],
            "assigned_sk": [
                3
            ]
        },
        "Bin": "C20",
        "item_ids": "['12752843']",
        "accuracy": 0,
        "status": "Pending"
    }];

    public static updatedBin = {
        "bin_id": ManageAuditsSpecVariables.binId,
        "Bin": "C69",
        "item_ids": "['12731370']",
        "accuracy": 0,
        "status": "Pending",
        "init_audit": 21,
        "customuser": 4
    };
}