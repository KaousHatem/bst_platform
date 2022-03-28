import React from 'react';
// import QRCode from "react-qr-code";
import QRCode from "qrcode.react";
// import { QRCode } from 'react-qrcode-logo';
import bstLogo from '../../../../public/static/bst-logo.jpg'

import {  Select, MenuItem, Box, Button, Container, Grid, Link, TextField, Typography, Card, CardContent, } from '@mui/material';

const icon = bstLogo.src
const QRGenerator = ({value}) => {
	// const [logo, setLogo] = useState(bstLogo.src)
	return(
		<Box>
			<QRCode
				id={value}
				value={value}
				size={128}
				level={'Q'}
				fgColor={'#04006e'}
				

			/>
		</Box>
		)
	}

export default QRGenerator;