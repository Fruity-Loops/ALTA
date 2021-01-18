from audit_template.models import AuditTemplate
from audit.models import Audit


def fetch_inventory_items(template):
    dict = {}
    categories = ['Location', 'Plant', 'Zone', 'Aisle', 'Bin', 'Part_Number', 'Serial_Number']
    for list, category in zip(
            [template.location, template.plant, template.zones, template.aisles, template.bins, template.part_number,
             template.serial_number], categories):
        # print(category + ' '+str(len(list)))
        if len(list):
            dict[category] = list

    # print(dict)
    sorted_keys = sorted(dict.keys())
    # print(sorted_keys)
    all_categories = sorted(dict)
    combinations = it.product(*(dict[category] for category in all_categories))
    queries = [x for x in combinations]  # converting the itertools object to a list
    # print(queries)
    # print(type(queries))
    # Location = 'YYC', Plant = 'Plant 2', Zone = 'B', Aisle = 3.0, Bin = 'A10', Part_Number = 'PART-4', Serial_Number = 'SN-4'
    kwargs = {}
    inventory_items_to_audit = []
    for query in queries:
        for category, value in zip(sorted_keys, query):
            kwargs[category] = value
        inventory_items = Item.objects.filter(**kwargs)
        # print(inventory_items)
        for i in range(len(inventory_items)):
            inventory_items_to_audit.append(inventory_items[i]._id)
        # inventory_items_to_audit = chain(inventory_items_to_audit, inventory_items)  #concatinating querysets objects

    print(inventory_items_to_audit)

    return inventory_items_to_audit


def create_audit(template_id):
    template = AuditTemplate.objects.get(template_id=template_id)

    inventory_items = fetch_inventory_items(template)

    # Creating the Audit and appending the template ID to it as well as the items
    audit = Audit(template_id=template_id)
    audit.save()

    # Didnt find another way of adding the list directly in the ManytoManyfield
    for item in inventory_items:
        audit.inventory_items.add(item)
