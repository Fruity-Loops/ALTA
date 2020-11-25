from django.apps import AppConfig


class ItemsConfig(AppConfig):
    name = 'inventory_item'

    # To let Django know it needs to kick off our updater on startup
    # overwrite the AppConfig.ready() method.
    def ready(self):
        from . import updater
        updater.start()
