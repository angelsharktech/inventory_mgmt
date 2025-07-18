import { Box } from '@mui/material';
import React from 'react'

const GenerateBill = React.forwardRef(({ bill }, ref) => {
    console.log('bill::',bill)
  return (
     <Box
      ref={ref}>
    <div>GenerateSaleBill</div>
    </Box>
  )

});
export default GenerateBill