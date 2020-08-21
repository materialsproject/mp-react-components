import React, { useState, useEffect, useCallback } from 'react';

interface ScrollspyProps {
	className: string;
	ids: string[];
	activeItemClassName: string;
	offset?: number;
	itemContainerClassName?: string;
	itemClassName?: string;
}

interface SpyItem {
	inView: boolean;
	element: HTMLElement | null;
}

export const Scrollspy: React.FC<ScrollspyProps> = ({
	className = 'menu',
	ids = [],
	activeItemClassName = 'is-active',
	offset = 0,
	itemContainerClassName = 'menu-list',
	itemClassName = ''
}) => {
	const [items, setItems] = useState<SpyItem[]>();
	const [count, setCount] = useState(0);

	function scrollTo(element: HTMLElement | null): void {
		if(element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest'
			});
		}
	}

	function spy(): void {
		let firstItemFound: boolean = false;
		const items: SpyItem[] = ids.map(id => {
			const element = document.getElementById(id);
			const item = {
				inView: element && !firstItemFound ? isInView(element) : false,
				element: element ? element : null
			};
			if(item.inView) firstItemFound = true;
			return item;
		});
		setItems(items);
	}

	const isInView = (element: HTMLElement) => {
		const rect = element.getBoundingClientRect();
		return rect.top >= 0 - offset && rect.bottom <= window.innerHeight + offset;
	}
	
	useEffect(() => {
		spy();
		window.addEventListener('scroll', spy);
		return function cleanup() {
			window.removeEventListener('scroll', spy);
		}
	}, []);

	return (
		<aside className={className} id="sidebar">
			<ul className={itemContainerClassName}>
				{items?.map((item, k) => {
					return (
						<li key={k}>
							<a 
								className={`${itemClassName} ${item.inView ? activeItemClassName : ''}`}
								onClick={() => scrollTo(item.element)}
							>
								{item.element ? item.element.innerText : ''}
							</a>								
						</li>
					)
				})}
			</ul>
		</aside>
	);
}

export default Scrollspy;