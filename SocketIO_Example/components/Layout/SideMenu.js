import React from "react";
import { List, Icon } from "semantic-ui-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { logoutUser } from "../../utils/authUser";

function SideMenu({
  user: { unreadNotification, email, unreadMessage, username },
}) {
  const router = useRouter();

  const isActive = (route) => router.pathname === route;

  return (
    <>
      <List
        style={{ paddingTop: "1rem" }}
        size="big"
        verticalAlign="middle"
        selection
      >
        <Link href="/">
          <List.Item active={isActive("/")}>
            <Icon name="home" size="large" color={isActive("/") && "teal"} />
            <List.Content>
              <List.Header content="Home" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link href="/messages">
          <List.Item active={isActive("/messages")} as="a" href="/messages">
            <Icon
              name={unreadMessage ? "hand point right" : "mail outline"}
              size="large"
              color={
                (isActive("/messages") && "teal") || (unreadMessage && "orange")
              }
            />
            <List.Content>
              <List.Header content="Messages" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link href="/notifications">
          <List.Item active={isActive("/notifications")}>
            <Icon
              name={unreadNotification ? "hand point right" : "bell outline"}
              size="large"
              color={
                (isActive("/notifications") && "teal") ||
                (unreadNotification && "orange")
              }
            />
            <List.Content>
              <List.Header content="Notifications" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <Link href={`/${username}`}>
          <List.Item active={router.query.username === username}>
            <Icon
              name="user"
              size="large"
              color={router.query.username === username && "teal"}
            />
            <List.Content>
              <List.Header content="Account" />
            </List.Content>
          </List.Item>
        </Link>
        <br />

        <List.Item onClick={() => logoutUser(email)}>
          <Icon name="log out" size="large" />
          <List.Content>
            <List.Header content="Logout" />
          </List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default SideMenu;


// Q: Why I have remove router.push and used <a> tag?

// Ans= 1. Now, when we are using router.push(), it doesn't refreshes the page. By that I mean is the refresh icon near the browser url doesn't change.

// Yes the page changes, but the browser is not refreshing. Now because of that, socket io uses the previous connection created on messages page. It doesn't disconnect on page change when we are using router.push.

// But, when using <a> tag, the browser makes a refresh and when we go to homepage, a completely new connection is made to socket io server.

// Now, this is completely optional. If you want to make use of previous connection, be my guest. I just thought that if the page is changing, socket io should make a new connection.

// You can also make a console.log("User disconnected") on the server at disconnect event. You will see this event only gets fired, when the browser refreshes for page change and not with router.push