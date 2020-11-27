import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMinusCircle,
  FaRocket,
} from 'react-icons/fa';
import { ThemeVariants } from '../../theme';

const variants: ThemeVariants = {
  icons: {
    success: FaCheckCircle,
    error: FaMinusCircle,
    retry: FaRocket,
    pending: FaRocket,
    info: FaInfoCircle,
    warning: FaExclamationTriangle,
  },
};

export default variants;
