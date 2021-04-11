
export class ManageMemberSpecVariables {
    public static initiatedBy = 2;
    public static skToAssign = 3;
    public static auditId = 1;
    public static binId = 1;

    public static accessedClients = [
        {
            user_name : 'sa2',
            first_name : 'system',
            last_name : 'admin',
            email : 'sa2@test.com',
            role : 'SA',
            location : null,
            is_active : false,
            id : 4
        }
    ];

    public static updatedPassword = {"password": 'a good password'}

    public static updatedEmployee = {
        first_name : 'a good name',
        last_name : 'admin'
    };

    public static employees = [
        {
            first_name : 'Avery',
            last_name : 'keeper',
            email : 'ak@gmail.com',
            role : 'SK',
            is_active : true,
            id : 7,
            location : 'YYZ',
            organization : 1,
            user_name : 'akeeper'
        },
        {
            first_name : 'inventory',
            last_name : 'manager',
            email : 'im@test.com',
            role : 'IM',
            is_active : true,
            id : 2,
            location : "Florida",
            organization : 1,
            user_name : 'im'
        },
        {
            first_name : 'stock',
            last_name : 'keeper',
            email : 'sk@test.com',
            role: 'SK',
            is_active : true,
            id : 3,
            location : 'Florida',
            organization : 1,
            user_name : 'sk'
        },
        {
            first_name : 'stock',
            last_name : 'keeper',
            email : 'sk1@test.com',
            role : 'SK',
            is_active : false,
            id : 5,
            location : 'YYZ',
            organization : 1,
            user_name : 'sk1000'
        }
    ];
}
