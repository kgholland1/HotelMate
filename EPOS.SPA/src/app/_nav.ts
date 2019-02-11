export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'fa fa-dashboard',
    allow: 'Admin,Manager,Supervisor,Staff'
  },
  {
    name: 'Guest',
    url: '/guests',
    icon: 'fa fa-user-plus',
    allow: 'Admin,Manager,Supervisor,Staff',
    children: [
      {
        name: 'Current Guests',
        url: '/guests/current',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin,Manager,Supervisor,Staff'
      },
      {
        name: 'Previous Guests',
        url: '/be/guest',
        icon: 'fa fa-dot-circle-o',
        allow: 'Staff'
      }
    ]
  },
  {
    name: 'Restaurant',
    url: '/restaurant',
    icon: 'fa fa-table',
    allow: 'Admin,Manager,Supervisor,Staff',
    children: [
      {
        name: 'Table Reservations',
        url: '/restaurant/reservations',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin,Manager,Supervisor,Staff'
      },
      {
        name: 'Room Orders',
        url: '/be/extra',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin,Manager,Supervisor,Staff'
      },
      {
        name: 'Pause Orders',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  },
  {
    name: 'House Keeping',
    url: '/housekeep',
    icon: 'fa fa-key',
    allow: 'Admin',
    children: [
      {
        name: 'House Keeping Services',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Taxi and Private Chauffer',
        url: '/housekeep/taxis',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'SPA Services',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Luggage Pickup',
        url: '/be/luggages',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Wake up call',
        url: '/be/wakes',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  },
  {
    name: 'Parking',
    url: '/be/guest',
    icon: 'fa fa-car',
    allow: 'Admin'
  },
  {
    name: 'Notifications',
    url: '/be/guest',
    icon: 'fa fa-bell',
    allow: 'Admin',
    children: [
      {
        name: 'Live Chat',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  },
  {
    name: 'Configuration',
    url: '/config',
    icon: 'fa fa-wrench',
    allow: 'Admin',
    children: [
      {
        name: 'Settings',
        url: '/config/system',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin',
        children: [
          {
            name: 'Restaurant settings',
            url: '/config/system/restaurants',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'Opening Hours settings',
            url: '/config/system/opentimes',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'House Keeping settings',
            url: '/config/guest',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'SPA Items settings',
            url: '/config/guest',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'Payment Methods',
            url: '/config/system/payments',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'Manage Templates',
            url: '/config/sysem/cards',
            icon: 'fa fa-dot-circle-o',
            allow: 'Admin'
          },
        ]
      },
      {
        name: 'Categories',
        url: '/config/menu/categories',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Options and Extras',
        url: '/config/menu/extras',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Menu',
        url: '/config/menu/menus',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Imports',
        url: '/config/menu/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  },
  {
    name: 'System',
    url: '/hotel',
    icon: 'fa fa-desktop',
    allow: 'Admin',
    children: [
      {
        name: 'Hotel Details',
        url: '/hotel/detail',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Rooms',
        url: '/hotel/rooms',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Tourist Guides',
        url: '/hotel/tourists',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'System Users',
        url: '/user/list',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Manage SMS',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  },
  {
    name: 'Reports',
    url: '/Menu',
    icon: 'fa fa-book',
    allow: 'Admin',
    children: [
      {
        name: 'General Reports',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  }
];

