import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'antd';
import { HomeFilled } from '@ant-design/icons';

const Breadcrumbs = ({ items }) => {
	const location = useLocation();
	const isHome = location.pathname === '/';

	return (
		<div>
			{!isHome && (
				<div className='top-navigation-container'>
					<div className='breadcrumb-container'>
						<Breadcrumb className='top-navigation-link'>
							<Breadcrumb.Item>
								<Link
									to='/'
									className={`breadcrumb-link ${
										!isHome ? 'active' : ''
									}`}
								>
									{!isHome && <HomeFilled />}Home
								</Link>
							</Breadcrumb.Item>
							{items.map((item, index) => (
								<Breadcrumb.Item key={index}>
									<Link
										to={item.href}
										className={`breadcrumb-link ${
											item.href !== '' ? 'active' : ''
										} ${item.href === '' ? 'current' : ''}`}
									>
										{item.title}
									</Link>
								</Breadcrumb.Item>
							))}
						</Breadcrumb>
					</div>
				</div>
			)}
		</div>
	);
};

export default Breadcrumbs;
