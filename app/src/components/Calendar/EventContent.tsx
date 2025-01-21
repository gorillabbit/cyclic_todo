import { Box, Tooltip } from '@mui/material';

const EventContent = (eventInfo: {
    timeText: string;
    event: { _def: { title: string } };
    backgroundColor?: string;
}) => {
    return (
        <Tooltip title={eventInfo.timeText + ' ' + eventInfo.event._def.title} disableInteractive>
            <Box width="100%" display="flex" justifyContent="center">
                <Box
                    width={10}
                    height={10}
                    bgcolor={eventInfo.backgroundColor ? eventInfo.backgroundColor : '#3788d8'}
                    borderRadius="50%"
                />
            </Box>
        </Tooltip>
    );
};

export default EventContent;
