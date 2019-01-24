export const navigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'fa fa-dashboard',
    allow: 'Admin,Manager,Supervisor,Staff'
  },
  {
    name: 'Guest',
    url: '/be/guests',
    icon: 'fa fa-user-plus',
    allow: 'Admin,Manager,Supervisor,Staff',
    children: [
      {
        name: 'Current Guests',
        url: '/be/guests',
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
    url: '/be/guests',
    icon: 'fa fa-table',
    allow: 'Admin,Manager,Supervisor,Staff',
    children: [
      {
        name: 'Table Reservations',
        url: '/be/reservations',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Room Orders',
        url: '/be/extra',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
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
    url: '/be/guest',
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
        url: '/be/taxis',
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
    name: 'Content Management',
    url: '/be/guest',
    icon: 'fa fa-gift',
    allow: 'Admin',
    children: [
      {
        name: 'Manage Templates',
        url: '/base/cards',
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
    name: 'Shopping',
    url: '/be/guest',
    icon: 'fa fa-shopping-cart',
    allow: 'Admin'
  },
  {
    name: 'Configuration',
    url: '/menu',
    icon: 'fa fa-wrench',
    allow: 'Admin',
    children: [
      {
        name: 'Settings',
        url: '/be/settings',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin',
        children: [
          {
            name: 'Restaurant settings',
            url: '/be/restaurants',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'Opening Hours settings',
            url: '/be/openHours',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'House Keeping settings',
            url: '/be/guest',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          },
          {
            name: 'SPA Items settings',
            url: '/be/guest',
            icon: 'fa fa-circle-thin',
            allow: 'Admin'
          }
        ]
      },
      {
        name: 'Categories',
        url: '/menu/categories',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Options and Extras',
        url: '/menu/extras',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Menu',
        url: '/be/menus',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Payment Methods',
        url: '/be/payments',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Imports',
        url: '/base/carousels',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      }
    ]
  },
  {
    name: 'System',
    url: '/user',
    icon: 'fa fa-desktop',
    allow: 'Admin',
    children: [
      {
        name: 'Hotel Details',
        url: '/menu/extras',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Rooms',
        url: '/menu/categories',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'Tourist Guides',
        url: '/menu/extras',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
      {
        name: 'System Users',
        url: '/user/list',
        icon: 'fa fa-dot-circle-o',
        allow: 'Admin'
      },
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

