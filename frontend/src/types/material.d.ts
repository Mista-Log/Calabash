declare module 'material/buttons/button.js' {
  export class MdButton extends HTMLElement {
    color: 'filled' | 'outlined' | 'tonal' | 'text' | 'elevated';
    size: 'small' | 'medium' | 'large';
    disabled: boolean;
    href?: string;
    target?: string;
    trailingIcon?: boolean;
    toggle?: boolean;
    selected?: boolean;
    type?: string;
  }
}

declare module 'material/buttons/icon-button.js' {
  export class MdIconButton extends HTMLElement {
    icon: string;
    size: 'small' | 'medium' | 'large';
    disabled: boolean;
    label?: string;
  }
}

declare module 'material/buttons/fab.js' {
  export class MdFab extends HTMLElement {
    icon?: string;
    label?: string;
    size: 'small' | 'medium' | 'large';
    disabled: boolean;
  }
}

declare module 'material/text/text-field.js' {
  export class MdTextField extends HTMLElement {
    color: 'outlined' | 'filled';
    label?: string;
    placeholder?: string;
    value: string;
    type: string;
    disabled: boolean;
    readOnly: boolean;
    required: boolean;
    error: boolean;
    errorMessage?: string;
    supportingText?: string;
    prefixText?: string;
    suffixText?: string;
    min?: string;
    max?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    step?: string;
    autocomplete?: string;
  }
}

declare module 'material/checkbox/checkbox.js' {
  export class MdCheckbox extends HTMLElement {
    checked: boolean;
    disabled: boolean;
    required: boolean;
    name: string;
    value: string;
  }
}

declare module 'material/radio/radio.js' {
  export class MdRadio extends HTMLElement {
    checked: boolean;
    disabled: boolean;
    name: string;
    value: string;
  }
}

declare module 'material/switch/switch.js' {
  export class MdSwitch extends HTMLElement {
    selected: boolean;
    disabled: boolean;
    name: string;
    value: string;
  }
}

declare module 'material/slider/slider.js' {
  export class MdSlider extends HTMLElement {
    value: number;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
  }
}

declare module 'material/select/select.js' {
  export class MdSelect extends HTMLElement {
    color: 'outlined' | 'filled';
    label?: string;
    value: string;
    selectedIndex: number;
    disabled: boolean;
    required: boolean;
    error: boolean;
    errorText?: string;
    supportingText?: string;
    menuAlign: 'start' | 'end';
    clampMenuWidth: boolean;
  }
}

declare module 'material/select/select-option.js' {
  export class MdSelectOption extends HTMLElement {
    value: string;
    selected: boolean;
    disabled: boolean;
    headline?: string;
  }
}

declare module 'material/tabs/tabs.js' {
  export class MdTabs extends HTMLElement {
    activeTabIndex: number;
    autoActivate: boolean;
  }
}

declare module 'material/tabs/tab.js' {
  export class MdTab extends HTMLElement {
    type: 'primary' | 'secondary';
    active: boolean;
    selected: boolean;
    inlineIcon: boolean;
  }
}

declare module 'material/nav/rail.js' {
  export class MdNavigationRail extends HTMLElement {}
}

declare module 'material/nav/bar.js' {
  export class MdNavigationBar extends HTMLElement {
    activeIndex: number;
  }
}

declare module 'material/nav/item.js' {
  export class MdNavigationItem extends HTMLElement {
    label?: string;
    href?: string;
    active: boolean;
    showBadge: boolean;
    badgeValue?: string | number;
  }
}

declare module 'material/menu/menu.js' {
  export class Menu extends HTMLElement {
    open: boolean;
    anchor?: string;
    anchorCorner?: string;
    menuCorner?: string;
    xOffset?: number;
    yOffset?: number;
    show: () => void;
    close: () => void;
  }
  export { Menu as MdMenu };
}

declare module 'material/menu/menu-item.js' {
  export class MenuItem extends HTMLElement {
    disabled: boolean;
    type: 'menuitem' | 'menuitemcheckbox' | 'menuitemradio' | 'link';
    href?: string;
    target?: string;
    keepOpen: boolean;
    selected: boolean;
  }
  export { MenuItem as MdMenuItem };
}

declare module 'material/menu/sub-menu.js' {
  export class SubMenu extends HTMLElement {}
  export { SubMenu as MdSubMenu };
}

declare module 'material/dialog/dialog.js' {
  export class Dialog extends HTMLElement {
    open: boolean;
    quick: boolean;
    returnValue: string;
    type: 'alert' | 'dialog';
    show: () => Promise<void> | void;
    close: (returnValue?: string) => Promise<void> | void;
  }
  export { Dialog as MdDialog };
}

declare module 'material/progress/progress.js' {
  export class MdProgress extends HTMLElement {
    type: 'circular' | 'linear';
    value: number;
    max: number;
    indeterminate: boolean;
    fourColor: boolean;
    buffer: number;
  }
}

declare module 'material/chips/chip-set.js' {
  export class MdChipSet extends HTMLElement {}
}

declare module 'material/chips/chip.js' {
  export class MdChip extends HTMLElement {
    type: 'assist' | 'filter' | 'input' | 'suggestion';
    label?: string;
    value?: string;
    selected: boolean;
    disabled: boolean;
    removable: boolean;
    elevated: boolean;
    avatar: boolean;
  }
}

declare module 'material/card/card.js' {
  export class MdCard extends HTMLElement {
    type: 'elevated' | 'outlined' | 'filled';
  }
}

declare module 'material/list/list.js' {
  export class MdList extends HTMLElement {}
}

declare module 'material/icon/icon.js' {
  export class MdIcon extends HTMLElement {
    icon: string;
  }
}

declare module 'material/divider/divider.js' {
  export class Divider extends HTMLElement {
    inset: boolean;
    insetStart: boolean;
    insetEnd: boolean;
  }
  export { Divider as MdDivider };
}

declare module 'material/snackbar/snackbar.js' {
  export class MdSnackbar extends HTMLElement {
    open: boolean;
    message: string;
  }
}

declare module 'material/badge/badge.js' {
  export class MdBadge extends HTMLElement {
    value?: number;
    label?: string;
  }
}




