import logoTextBlack from '@/assets/icon/dashbord/logo-text-black.svg';
import logo from '@/assets/logo-graph@2x.png';
import logo02 from '@/assets/logo-02.png';
import styles from './index.less';
import type { FC, MouseEvent } from 'react';
interface LogoComposeProps {
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}
const LogoCompose: FC<LogoComposeProps> = ({ onClick }) => {
  return (
    <div className={styles.header_logo} onClick={()=>{}}>
      {/* <img src={logo} width={30} height={30} /> */}
      {/* <img src={logoTextBlack} height={30} width={82} /> */}
      <img src={logo02}  height={30} />
      <div className={styles.logoLine} />
      {/* <img src={localname} height={30} width={60} /> */}
      <span className={styles.productName}>ParseX</span>
    </div>
  );
};
export default LogoCompose;
