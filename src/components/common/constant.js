import {
  LayoutDashboard,
  CalendarDays,
  CalendarFold,
  Activity,
  Inbox,
  Users,
  Settings2,
  Mail,
  Star,
  Settings,
  Bell,
  MessageSquareCode
} from "lucide-react";

const menu_principale = [
  {
    title: "Accueil",
    url: "/praticien/premierPas",
    icon: LayoutDashboard,
  },
  {
    title: "Agenda",
    url: "/agenda",
    icon: CalendarDays,
  },
  // {
  //   title: "Message",
  //   url: "#",
  //   icon: Inbox,
  // },
];

const menu_secondaire = [
  {
    title: "Parametrages",
    url: "#",
    icon: Settings,
    isActive: true,
    items: [
      {
        title: "Plage horaire",
        // url: "/plage-horaire",
        icon: CalendarFold,
      },
      {
        title: "Mes patients",
        // url: "/praticien/patients",
        icon: Users,
      },
    ]
  },
]

const menu_secondaire2 = [
  {
    title: "Suivi & échanges",
    url: "#",
    icon: Settings2,
    isActive: true,
    items: [
     
      {
        title: "Messages",
        // url: "/pratiques",
        icon: Mail,
      },
       {
        title: "Avis patients",
        // url: "/pratiques",
        icon: MessageSquareCode,
      },
       {
        title: "Notification",
        // url: "/pratiques",
        icon: Bell,
      },
     
    ]
  },
]

const user_test = {
  user_mail: "logintest@gmail.com",
  mot_de_passe: "logintest"
}

export { menu_principale, menu_secondaire, user_test, menu_secondaire2 };
