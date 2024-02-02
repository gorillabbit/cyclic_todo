import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { updateDocLog } from "../../firebase";
import { LogType } from "../../types";

interface LogDisplayFeatureSelectorProp {
  log: LogType;
}

const updateDisplayFeature = (log: any, feature: any) => {
  if (log.displayFeature.includes(feature)) {
    const index = log.displayFeature.indexOf(feature);
    const newDisplayFeature = log.displayFeature.splice(1, index);
    updateDocLog(log.id, { displayFeature: [...newDisplayFeature] });
  } else {
    updateDocLog(log.id, { displayFeature: [...log.displayFeature, feature] });
  }
};

const allFeatures = [
  "標準間隔",
  "本日回数",
  "通算回数",
  "音声案内",
  "前回からの間隔",
];
const LogDisplayFeatureSelector: React.FC<LogDisplayFeatureSelectorProp> = ({
  log,
}) => {
  return (
    <Box>
      {log.displayFeature &&
        allFeatures.map((feature: string) => (
          <FormControlLabel
            onClick={(e) => e.stopPropagation()}
            sx={{ m: 0 }}
            control={
              <Checkbox
                size="small"
                sx={{ p: 0 }}
                onChange={() => updateDisplayFeature(log, feature)}
                checked={log.displayFeature.includes(feature)}
              />
            }
            label={feature}
          />
        ))}
    </Box>
  );
};

export default LogDisplayFeatureSelector;
