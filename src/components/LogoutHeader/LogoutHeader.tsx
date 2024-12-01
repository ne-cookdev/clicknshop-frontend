import React from "react";

import { HistoryItemsIcon } from "../Icons/HistoryItemsIcon";
import { CartIcon } from "../Icons/CartIcon";
import { CatalogIcon } from "../Icons/CatalogIcon";
import { LogoutIcon } from "../Icons/LogoutIcon";

interface LogoutHeaderProps {
  role: string;
  onClickHandler: () => void;
}

export const LogoutHeader: React.FC<LogoutHeaderProps> = (props) => {
  return (
    <>
      <div className="logoutheader_div">
        <div className="flex flex-row gap-x-6">
          {props.role != "admin" && props.role != "superuser" && (
            <>
              <a href="/history">
                <HistoryItemsIcon className="logoutheader_icon" />
              </a>
              <a href="/cart">
                <CartIcon className="logoutheader_icon" />
              </a>
              <a href="/catalog">
                <CatalogIcon className="logoutheader_icon" />
              </a>
            </>
          )}
        </div>
        <h1 className="logoutheader_h1">click'n'shop</h1>
        <div onClick={props.onClickHandler} className="logoutheader_logout_div">
          <span className="logoutheader_logout_span">Выйти</span>
          <LogoutIcon className="logoutheader_logout_icon" />
        </div>
      </div>
    </>
  );
};
