import React from 'react';
import Scrollspy from '../navigation/Scrollspy';

export const SidebarScrollspy = () => (
	<div className="sidebar-story">
		<Scrollspy ids={["one", "two", "three"]}
			className="menu"
			itemContainerClassName="menu-list"
			activeItemClassName="is-active"/>
		<div className="content">
			<h1 id="one">First</h1>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?</p>
			<h1 id="two">Second</h1>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?</p>
			<h1 id="three">Third</h1>
			<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi beatae dicta dolores praesentium voluptatem earum, facere doloremque corporis numquam nemo molestiae ipsam voluptate nihil explicabo deleniti nostrum quisquam consequatur consectetur?</p>
		</div>
	</div>
);
	
export default {
    component: Scrollspy,
	title: 'Sidebar'
};