from django.apps import AppConfig


class ItemsConfig(AppConfig):
    name = 'inventory_item'

    # To let Django know it needs to kick off our updater on startup
    # overwrite the AppConfig.ready() method.
    def ready(self):
        #  Due to the intricacies of inheritance, any imports for this
        #  override must be located within be body of the ready() method
        #  related article:
        # https://medium.com/@kevin.michael.horan
        # /scheduling-tasks-in-django-with-the-advanced-python-scheduler-663f17e868e6
        from . import updater
        updater.start()
