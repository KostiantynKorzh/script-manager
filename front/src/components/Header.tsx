import React from "react";
import { Link } from "react-router-dom";

export const Header = () => {
	return (
		<>
			<div>
				<Link to='/creation'>Creation</Link>
			</div>
			<div>
				<Link to='/jobs'>Jobs</Link>
			</div>
			<div>
				<Link to='/scripts'>Scripts</Link>
			</div>
		</>
	);
};

export default Header;