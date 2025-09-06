// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
import { useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CreateIcon from "@mui/icons-material/Create";
import AddBookModal from "./Modals/AddBookManually";
import ScanQRModal from "./Modals/ScanQrModal";
import SearchBookModal from "./Modals/SearchBookModal";

export default function AddBookSpeedDial() {
  const [openAddModal, setAddOpenModal] = useState(false);
  const [openSearchModal, setOpenSerachModal] = useState(false);
  const [openScanModal, setOpenScanModal] = useState(false);
  const actions = [
    {
      icon: <CreateIcon />,
      name: "Add Manually",
      onClick: () => setAddOpenModal(true),
    },
    {
      icon: <SearchIcon />,
      name: "Search Book",
      onClick: () => setOpenSerachModal(true),
    },
    {
      icon: <QrCodeScannerIcon />,
      name: "Scan QR",
      onClick: () => setOpenScanModal(true),
    },
  ];
  return (
    <>
      <Box sx={{ position: "fixed", bottom: 32, right: 32 }}>
        <SpeedDial
          ariaLabel="Add Book"
          icon={<SpeedDialIcon openIcon={<AddIcon />} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
        </SpeedDial>
      </Box>

      <AddBookModal
        open={openAddModal}
        onClose={() => setAddOpenModal(false)}
      />
      <ScanQRModal
        open={openScanModal}
        onClose={() => setOpenScanModal(false)}
      />
      <SearchBookModal
        open={openSearchModal}
        onClose={() => setOpenSerachModal(false)}
      />
    </>
  );
}
