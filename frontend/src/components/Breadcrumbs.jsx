import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { APP_DEFAULT_PATH } from "config";
import navigation from "menu-items";

export default function Breadcrumbs() {
  const location = useLocation();
  const [main, setMain] = useState({});
  const [sub, setSub] = useState({});
  const [item, setItem] = useState({});

  const getCollapse = useCallback(
    (menuList) => {
      menuList.forEach((group) => {
        if (group.children) {
          group.children.forEach((collapse) => {
            const isMatchParent = location.pathname === collapse.url;

            if (isMatchParent) {
              setMain({ title: group.title });
              setItem({
                title: collapse.title,
                breadcrumbs: collapse.breadcrumbs !== false,
              });
              setSub({});
            }

            if (collapse.children) {
              collapse.children.forEach((child) => {
                const isMatchChild =
                  location.pathname === child.url ||
                  location.pathname.startsWith(child.url + "/");

                if (isMatchChild) {
                  setMain({ title: group.title });
                  setSub({ title: collapse.title, url: collapse.url });
                  setItem({ title: child.title });
                }
              });
            }
          });
        }
      });
    },
    [location.pathname],
  );

  useEffect(() => {
    setMain({});
    setSub({});
    setItem({});
    if (navigation.items) {
      getCollapse(navigation.items);
    }
  }, [location.pathname, getCollapse]);

  let breadcrumbContent = null;

  if (item?.title) {
    breadcrumbContent = (
      <div className="page-header">
        <div className="page-block">
          <Row className="align-items-center">
            <Col md={12} className="page-header-title text-capitalize">
              <h5>{item.title}</h5>
            </Col>
            <Col md={12}>
              <Breadcrumb listProps={{ style: { marginBottom: 0 } }}>
                <Breadcrumb.Item
                  linkAs={Link}
                  linkProps={{ to: APP_DEFAULT_PATH }}
                >
                  Home
                </Breadcrumb.Item>
                {main.title && (
                  <Breadcrumb.Item
                    linkAs={Link}
                    linkProps={{ to: sub.url }}
                    active={!sub.title && !item.title}
                  >
                    {main.title}
                  </Breadcrumb.Item>
                )}
                {sub.title && (
                  <Breadcrumb.Item linkAs={Link} linkProps={{ to: sub.url }}>
                    {sub.title}
                  </Breadcrumb.Item>
                )}
                <Breadcrumb.Item active>{item.title}</Breadcrumb.Item>
              </Breadcrumb>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  return <>{breadcrumbContent}</>;
}
