import React, { useState, useEffect } from 'react';

interface MenuGroup {
	label?: string;
	items: MenuItem[];
}

interface MenuItem {
	label: string;
	targetId: string;
	items?: MenuItem[];
}

interface ScrollspyProps {
	className: string;
	menuGroups: MenuGroup[]
	activeItemClassName: string;
	offset?: number;
	menuLabelClassName?: string;
	menuContainerClassName?: string;
	menuItemClassName?: string;
}

interface SpyItemMap {
	[id: string]: boolean
}

export const Scrollspy: React.FC<ScrollspyProps> = ({
	menuGroups,
	className = 'menu',
	activeItemClassName = 'is-active',
	offset = -20,
	menuLabelClassName = 'menu-label',
	menuContainerClassName = 'menu-list',
	menuItemClassName = ''
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
		return group.label ? <p className={menuLabelClassName || undefined}>{group.label}</p> : null;
	}

	const getMenuItemLink = (item: MenuItem) => {
		return (
			<a 
				className={spyItemsViewMap[item.targetId] ? activeItemClassName : ''} 
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
		<aside className={className}>
			{menuGroups.map((group, k) => {
					return (
						<div key={k}>
							{getMenuGroupLabel(group)}
							<ul className={menuContainerClassName || undefined}>
								{group.items.map((item, i) => {
									return (
										<li key={i} className={menuItemClassName || undefined}>
											{getMenuItemLink(item)}
											{item.items && 
												<ul className={menuContainerClassName || undefined}>
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