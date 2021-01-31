import itertools as it
from audit_template.models import AuditTemplate
from audit.models import Audit
from inventory_item.models import Item


def fetch_inventory_items(template):
    dict = {}
    categories = ['Location', 'Plant', 'Zone', 'Aisle', 'Bin', 'Part_Number', 'Serial_Number']

    # Constructing the dict based on what optional criteria were added
    for filters, category in zip(
            [template.location, template.plant, template.zones, template.aisles,
             template.bins, template.part_number, template.serial_number],
            categories):

        if filters:
            dict[category] = filters

    sorted_keys = sorted(dict.keys())
    all_categories = sorted(dict)

    # Finding all the different combinations based on the criteria selected
    combinations = it.product(*(dict[category] for category in all_categories))
    queries = [x for x in combinations]  # converting the itertools object to a list

    kwargs = {}
    inventory_items_to_audit = []
    # TODO To be further looked into for a more efficient solution
    for query in queries:
        for category, value in zip(sorted_keys, query):
            kwargs[category] = value

        # Fetching the inventory items corresponding to the criteria selected
        # for all combinations
        inventory_items = Item.objects.filter(**kwargs)

        # Appending the element of the Queryset object to the list
        # (Didn't find a way to cast it to a list)
        for i in range(len(inventory_items)):
            inventory_items_to_audit.append(inventory_items[i]._id)

    return inventory_items_to_audit


def create_audit(template_id):
    template = AuditTemplate.objects.get(template_id=template_id)
    inventory_items = fetch_inventory_items(template)

    # Creating the Audit and appending the template ID to it as well as the items
    audit = Audit(template_id=template)
    audit.save()

    # Didnt find another way of adding the list directly in the ManytoManyfield
    for item in inventory_items:
        audit.inventory_items.add(item)
