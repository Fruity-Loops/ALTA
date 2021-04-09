export class ManageInventoryItemsSpecVariables {
    public static initiatedBy = 2;
    public static skToAssign = 3;
    public static auditId = 1;
    public static binId = 1;

    public static pageItems = {
        "count": 2,
        "next": null,
        "previous": null,
        "results": [
            {
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
        ]
    };

    public static itemsFromTemplate = [
        {
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
    ];
}