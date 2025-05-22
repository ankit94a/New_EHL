import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSidebar',
  standalone: true
})
export class FilterSidebarPipe implements PipeTransform {

  transform(menus: any[], roleType: string): any[] {
    if (!menus) return [];

    // const restrictedForRole2 = [
    //   'Dashboard', 'Confidential', 'Contracts', 'Home Page', 'Attribute', 'Eqpt Appreciation'
    // ];
    const restrictedForRole3 = ['Dashboard', 'Home Page', 'Attribute'];

    // If roleType is '2', apply full restrictions
    // if (roleType === null) {
    //   return this.filterMenus(menus, restrictedForRole2);
    // }

    // If roleType is '3', apply limited restrictions
    if (roleType === null) {
      return this.filterMenus(menus, restrictedForRole3);
    }

    // For other roles (like '1'), return full menu
    return menus;
  }

  private filterMenus(menus: any[], restricted: string[]): any[] {
    return menus
      .filter(menu => !restricted.includes(menu.text))
      .map(menu => {
        if (menu.children?.length) {
          const filteredChildren = menu.children.filter(child => !restricted.includes(child.text));
          return { ...menu, children: filteredChildren };
        }
        return menu;
      })
      .filter(menu => !menu.children || menu.children.length > 0);
  }
}
