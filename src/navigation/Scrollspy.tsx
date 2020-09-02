import React, { useState, useEffect } from 'react';

/**
 * Component for building in-page navigation menus with scrollspy functionality
 */
interface ScrollspyProps {
	/**
	 * An array of MenuGroup items that is used to build the menu and its links.
	 * Each MenuGroup has an optional label and a required 'items' array of MenuItems.
	 * Each MenuItem has a label that is rendered in the menu and a targetId that is the id of the element it should link to.
	 * Do not include '#' in targetId.
	 * example:
		  [
				{label: '...', items: [
					{label: '...', targetId: '...'}, 
					{label: '...', targetId: '...', items: [
						{label: '...', targetId: '...'}
					}]
				]}
			]
	 */
	menuGroups: MenuGroup[]
	/**
	 * Class name applied to active links in the menu (default: 'is-active')
	 */
	activeClassName: string;
	/**
	 * Class name applied to the <aside> that contains the whole menu (default: 'menu')
	 */
	menuClassName?: string;
	/**
	 * Class name applied to all menu group labels (default: 'menu-label')
	 */
	menuGroupLabelClassName?: string;
	/**
	 * Class name applied to each <ul> of menu items (default: 'menu-list')
	 */
	menuItemContainerClassName?: string;
	/**
	 * Class name applied to the <li> of each menu item (default: '')
	 */
	menuItemClassName?: string;
	/**
	 * An integer to determine the scroll offset from an item that will trigger it active (default: -20)
	 */
	offset?: number;
}

interface MenuGroup {
	label?: string;
	items: MenuItem[];
}

interface MenuItem {
	label: string;
	targetId: string;
	items?: MenuItem[];
}

interface SpyItemMap {
	[id: string]: boolean
}

export const Scrollspy: React.FC<ScrollspyProps> = ({
	menuGroups,
	menuClassName = 'menu',
	activeClassName = 'is-active',
	menuGroupLabelClassName = 'menu-label',
	menuItemContainerClassName = 'menu-list',
	menuItemClassName = '',
	offset = -20
}) => {
	const [spyItemsViewMap, setSpyItemsViewMap] = useState(initSpyItemsViewMap);

	function initSpyItemsViewMap(): SpyItemMap {
		let viewMap: SpyItemMap = {};
		menuGroups.forEach((group) => {
			group.items.forEach((item) => {
				viewMap[item.targetId] = false;
				item.items?.forEach((subitem) => {
					viewMap[subitem.targetId] = false;
				});
			});
		});
		return viewMap;
	}

	function spy(): void {
		let firstItemFound: boolean = false;
		let newSpyItemsViewMap: SpyItemMap = {};
		Object.keys(spyItemsViewMap).forEach(key => {
			newSpyItemsViewMap[key] = firstItemFound ? false : isInView(key);
			if(newSpyItemsViewMap[key]) firstItemFound = true;
		});
		setSpyItemsViewMap(newSpyItemsViewMap);
	}

	const isInView = (targetId: string) => {
		const element = document.getElementById(targetId);
		if(element) {
			const rect = element.getBoundingClientRect();
			return rect.bottom >= 0 - offset;
		} else {
			return false;
		}
	}

	const getMenuGroupLabel = (group: MenuGroup) => {
		return group.label ? <p className={menuGroupLabelClassName || undefined}>{group.label}</p> : null;
	}

	const getMenuItemLink = (item: MenuItem) => {
		return (
			<a 
				className={spyItemsViewMap[item.targetId] ? activeClassName : ''} 
				href={`#${item.targetId}`}
			>
					{item.label}
			</a>
		)
	}

	useEffect(() => {
		spy();
		window.addEventListener('scroll', spy);
		return function cleanup() {
			window.removeEventListener('scroll', spy);
		}
	}, []);

	return (
		<aside className={menuClassName}>
			{menuGroups.map((group, k) => {
					return (
						<div key={k}>
							{getMenuGroupLabel(group)}
							<ul className={menuItemContainerClassName || undefined}>
								{group.items.map((item, i) => {
									return (
										<li key={i} className={menuItemClassName || undefined}>
											{getMenuItemLink(item)}
											{item.items && 
												<ul className={menuItemContainerClassName || undefined}>
													{item.items.map((subitem, j) => {
														return (
															<li key={j} className={menuItemClassName || undefined}>
																{getMenuItemLink(subitem)}
															</li>
														)
													})}
												</ul>
											}
										</li>
									)
							})}
							</ul>
						</div>
					)
			})}
		</aside>
	);
}