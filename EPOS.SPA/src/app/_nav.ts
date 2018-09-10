export const navigation = [
  {
    name: 'Dashboard',
    url: '/be/dashboard',
    icon: 'fa fa-dashboard',
    allow: 'canAccessBackend'
  },
  {
    name: 'Guest',
    url: '/be/guests',
    icon: 'fa fa-user-plus',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'Current Guests',
        url: '/be/guests',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Previous Guests',
        url: '/be/guest',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      }
    ]
  },
  {
    name: 'Restaurant',
    url: '/be/guests',
    icon: 'fa fa-table',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'Table Reservations',
        url: '/be/reservations',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Room Orders',
        url: '/be/extra',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Pause Orders',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      }
    ]
  },
  {
    name: 'House Keeping',
    url: '/be/guest',
    icon: 'fa fa-key',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'House Keeping Services',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Taxi and Private Chauffer',
        url: '/be/taxis',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'SPA Services',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Luggage Pickup',
        url: '/be/luggages',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Wake up call',
        url: '/be/wakes',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      }
    ]
  },
  {
    name: 'Content Management',
    url: '/be/guest',
    icon: 'fa fa-gift',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'Manage Templates',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Manage SMS',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/be/guest',
    icon: 'fa fa-bell',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'Live Chat',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      }
    ]
  },
  {
    name: 'Shopping',
    url: '/be/guest',
    icon: 'fa fa-shopping-cart',
    allow: 'canAccessBackend'
  },
  {
    name: 'Configuration',
    url: '/be/guests',
    icon: 'fa fa-wrench',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'Settings',
        url: '/be/settings',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend',
        children: [
          {
            name: 'Restaurant settings',
            url: '/be/restaurants',
            icon: 'fa fa-circle-thin',
            allow: 'canAccessBackend'
          },
          {
            name: 'Opening Hours settings',
            url: '/be/openHours',
            icon: 'fa fa-circle-thin',
            allow: 'canAccessBackend'
          },
          {
            name: 'House Keeping settings',
            url: '/be/guest',
            icon: 'fa fa-circle-thin',
            allow: 'canAccessBackend'
          },
          {
            name: 'SPA Items settings',
            url: '/be/guest',
            icon: 'fa fa-circle-thin',
            allow: 'canAccessBackend'
          }
        ]
      },
      {
        name: 'Categories',
        url: '/be/categories',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Options and Extras',
        url: '/be/extras',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Menu',
        url: '/be/menus',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Payment Methods',
        url: '/be/payments',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Imports',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessSMS'
      }
    ]
  },
  {
    name: 'System',
    url: '/be/hotel',
    icon: 'fa fa-desktop',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'Hotel Details',
        url: '/be/hotel',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Rooms',
        url: '/be/rooms',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'Tourist Guides',
        url: '/be/tourists',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      },
      {
        name: 'System Users',
        url: '/be/users',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessSecurity'
      },
    ]
  },
  {
    name: 'Reports',
    url: '/Menu',
    icon: 'fa fa-book',
    allow: 'canAccessBackend',
    children: [
      {
        name: 'General Reports',
        url: '/base/cards',
        icon: 'fa fa-dot-circle-o',
        allow: 'canAccessBackend'
      }
    ]
  }
];

