export default interface IMenuInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuItemInfo {
  title: string;
}

export interface IMenuExternalItemInfo extends IMenuInfo {
  multi: boolean;
  url: string;
  mid: number;
}

export interface IMenuLevelInfo extends IMenuItemInfo {
  nodes: Array<IMenuItemInfo>;
}

export interface IMenuPageInfo extends IMenuItemInfo {
  pid: number;
}

// const t: IMenuInfo = {
//   nodes: [
//     {
//       title: "اطلاعات کاربری",
//       pid: "1",
//     },
//     {
//       title: "مدیریت فایل ها",
//       nodes: [
//         { title: "فایل های من", pid: 4 },
//         { title: "اشتراک با من", pid: 5 },
//       ],
//     },
//     { title: "تقویم", pid: 6 },
//     {
//       mid: 2,
//       title: "Ticketing",
//       multi: true,
//       url: "185.44.36.103",
//     },
//     {
//       mid: 4,
//       title: "TaskManager",
//       multi: false,
//       url: "185.44.36.103",
//     },
//   ],
// };
const u = [
  {
    menu: [
      {
        internal: [
          { title: "اطلاعات کاربری", pid: 1 },
          {
            title: "مدیریت فایل ها",
            pid: 0,
            submenu: [
              { title: "فایل های من", pid: 4 },
              { title: "اشتراک با من", pid: 5 },
            ],
          },
          { title: "تقویم", pid: 6 },
        ],
        external: [
          {
            moduleid: 2,
            title: "Ticketing",
            multi: true,
            connection: [{ ip: "185.44.36.103" }],
          },
          {
            moduleid: 4,
            title: "TaskManager",
            multi: false,
            connection: [{ ip: "185.44.36.103" }],
          },
        ],
      },
    ],
  },
];
