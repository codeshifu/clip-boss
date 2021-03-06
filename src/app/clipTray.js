import { Menu, shell, Tray, ipcMain } from 'electron';

import AppMenu from './menu';
import * as evt from './evt';

class ClipTray {
  constructor(trayIcon, win, bot) {
    this.tray = new Tray(trayIcon);
    this.tray.setToolTip('ClipBot');
    this.win = win;
    this.bot = bot;

    this.buildMenu();
    return this.tray;
  }

  buildMenu() {
    const win = this.win;
    const fakerMenu = AppMenu.getFakerMenu();

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'About ClipBot',
        click() {
          shell.openExternal('https://github.com/codeshifu/clipbot');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Clip fake data',
        submenu: [...fakerMenu]
      },
      {
        label: 'Show ClipBot',
        accelerator: 'CmdOrCtrl+Shift+C',
        click() {
          win.show();
        }
      },
      {
        label: 'Clear clipboard',
        click() {
          if (!win.isVisible()) win.show();
          win.webContents.send(evt.CLEAR);
        }
      },
      { type: 'separator' },
      {
        label: 'Preferences',
        submenu: [
          {
            label: 'Launch at Login',
            id: 'launch-at-login',
            type: 'checkbox',
            click(menuItem) {
              win.webContents.send(
                evt.UPDATE_LAUNCH_AT_LOGIN_STATUS,
                menuItem.checked
              );
            }
          }
        ]
      },
      {
        label: 'Help',
        click() {
          shell.openExternal('https://github.com/codeshifu/clipbot/issues');
        }
      },
      { type: 'separator' },
      {
        label: 'Quit ClipBot',
        accelerator: 'CmdOrCtrl+Q',
        click() {
          if (!win.isVisible()) win.show();
          win.webContents.send(evt.QUIT);
        }
      }
    ]);

    ipcMain.on(evt.LAUNCH_AT_LOGIN, (e, shouldLaunch) => {
      const menuItem = contextMenu.getMenuItemById('launch-at-login');
      menuItem.checked = shouldLaunch;
    });

    this.tray.setContextMenu(contextMenu);
  }
}

export default ClipTray;
