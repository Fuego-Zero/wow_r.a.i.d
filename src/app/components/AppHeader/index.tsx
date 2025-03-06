import { Button } from "antd";
import React from "react";

function AppHeader() {
  return (
    <div className="flex">
      <h1 className="flex-1">
        <span className="text-2xl text-amber-50">WOW R.A.I.D</span>
        <span className="ml-2">(Roster Auto-Integrated Deployment)</span>
      </h1>

      <div>
        <Button>上传名单</Button>
        <Button className="ml-5" type="primary">
          自动分配
        </Button>
      </div>
    </div>
  );
}

export default AppHeader;
