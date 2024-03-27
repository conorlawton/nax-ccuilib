export {};

declare global {
	namespace sc {
		interface QuickMenuButtonGroup extends ig.ButtonGroup {
			repeater: ig.PressRepeater;
			lastDir: Vec2;
			elements: sc.RingMenuButton[][];

			setButtons(this: this, ...buttons: sc.RingMenuButton[]): void;
			doButtonTraversal(this: this, focusRegained?: boolean, dirOverride?: Vec2): void;
			focusButtonByRingId(this: this, ringId: number): void;
			getRepeaterDir(this: this, dirVec: Vec2): string | undefined;
			getRepeaterValue(this: this, dirVec: Vec2): string | null;
			getRingIdFromDir(this: this, dir: string, id: number): number;
		}
		interface RingMenuButton {
			title: string;
			ringId: number;
			isAToggle?: boolean;

            getLocalStorageToggleId(this: this): string
            isToggleOn(this: this): boolean
		}

		interface QuickRingMenu {
			currentRingIndex: number;
			ringAngles: Record<number, { pure: Vec2; position: Vec2 }>;
			selectedToMoveButton?: sc.RingMenuButton;
			dummyButtonsCreated?: boolean;
			possibleSelGridIds: number[];
			editModeOn: boolean;
			openendAtLeastOnce: boolean;
			infoBar: sc.InfoBar;

			onWidgetListUpdate(this: this): void;
			createButton(this: this, widget: nax.ccuilib.QuickMenuWidget): sc.RingMenuButton;
			createButtons(this: this, initAll?: boolean): void;
			setButtonId(this: this, button: sc.RingMenuButton, id: number): void;
			enterEditMode(this: this): void;
			exitEditMode(this: this): void;
			showDummyButtons(this: this): void;
			hideDummyButtons(this: this): void;
			nextRing(this: this, add: number): boolean;
		}

		interface QuickRingMenuConstructor {
			instance: QuickRingMenu;
		}
	}
}
