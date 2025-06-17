import { PiNotepadLight } from "react-icons/pi";
import { TfiLocationPin } from "react-icons/tfi";
import { IoDownloadOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { RxDashboard } from "react-icons/rx";

export const MyAccountData = [
  {
    id: 1,
    title: "Dashboard",
    icon: <RxDashboard />,
    route: "/my-account",
  },
  {
    id: 2,
    title: "Orders",
    icon: <PiNotepadLight />,
    route: "/my-account/orders",
  },
  {
    id: 3,
    title: "Downloads",
    icon: <IoDownloadOutline />,
    route: "/my-account/downloads",
  },
  {
    id: 4,
    title: "Address",
    icon: <TfiLocationPin />,
    route: "/my-account/addresses",
  },
  {
    id: 5,
    title: "Account Details",
    icon: <PiUserCircleLight />,
    route: "/my-account/account-details",
  },
];
