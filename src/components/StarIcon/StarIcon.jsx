import { Box, } from "@shopify/polaris";
import { StarFilledMinor, StarOutlineMinor, } from '@shopify/polaris-icons';
import { CustomStarIcon } from "./CustomStarIcon";

export const StarIcon = ({ filled, onClick, onMouseEnter, onMouseLeave, settings }) => {
    return (
        <Box style={{
            cursor: 'pointer', width: '60px', height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

        }} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <CustomStarIcon primaryColor={((settings || {}).design || {}).primaryColor} secondaryColor={((settings || {}).design || {}).secondaryColor} filled={filled} source={filled ? StarFilledMinor : StarOutlineMinor} />
        </Box>
    )
};