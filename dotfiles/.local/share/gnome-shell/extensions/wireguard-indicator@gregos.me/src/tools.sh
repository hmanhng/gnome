#!/bin/bash

set -e

USERNAME=`whoami`
INTERFACE="wg0"
EXIT_SUCCESS=0
EXIT_INVALID_ARG=1
EXIT_FAILED=0

ACTION=$1


function usage() {
    echo "Usage: installer.sh [options] {supported,install,check,update,uninstall}"
    echo
    echo "Available options:"
    echo "  --prefix PREFIX        Set the install prefix (default: /usr)"
    echo "  --tool-suffix SUFFIX   Set the tool name suffix (default: <empty>)"
    echo
    exit ${EXIT_INVALID_ARG}
}

if [ $# -lt 1 ]
then
    usage
fi

ACTION=""
while [[ $# -gt 0 ]]
do
    key="$1"

    # we have to use command line arguments here as pkexec does not support
    # setting environment variables
    case $key in
        --user)
            USERNAME="$2"
            shift
            shift
            ;;
        --interface)
            INTERFACE="$2"
            shift
            shift
            ;;
        present|test|install|check|remove)
            if [ -z "$ACTION" ]
            then
                ACTION="$1"
            else
                echo "Too many actions specified. Please give at most 1."
                usage
            fi
            shift
            ;;
        *)
            echo "Unknown argument $key"
            usage
            ;;
    esac
done


SUDOERS_TXT="$USERNAME ALL=(root) NOPASSWD: /bin/wg show $INTERFACE\n$USERNAME ALL=(root) NOPASSWD: /bin/systemctl show -p LoadState -p ActiveState wg-quick@$INTERFACE.service\n$USERNAME ALL=(root) NOPASSWD: /bin/systemctl start wg-quick@$INTERFACE.service\n$USERNAME ALL=(root) NOPASSWD: /bin/systemctl stop wg-quick@$INTERFACE.service"
SUDOERSD_FILE="/etc/sudoers.d/wireguard-$USERNAME-$INTERFACE"


if [ "$ACTION" = "present" ]
then
    A=`echo -e $SUDOERS_TXT | md5sum | awk '{print $1}'`
    if [ -f /bin/sudo ] && [ -f /etc/sudoers ]
    then
        B=`sudo md5sum $SUDOERSD_FILE | awk '{print $1}'`
        if [ $A == $B ]
        then
            echo "present"
            exit $EXIT_SUCCESS
        fi
    fi
    echo "absent"
    exit $EXIT_FAILED
fi


if [ "$ACTION" = "test" ]
then
    sudo systemctl show -p LoadState -p ActiveState wg-quick@$INTERFACE.service

    exit $EXIT_SUCCESS
fi


if [ "$ACTION" = "check" ]
then
    if [ -f /bin/sudo ] && [ -f /etc/sudoers ] && [ -d /etc/sudoers.d ]
    then
        echo "sudo ok"
        exit $EXIT_SUCCESS
    else
        echo "sudo missing"
        exit $EXIT_FAILED
    fi
fi

if [ "$ACTION" = "install" ]
then
    echo -e $SUDOERS_TXT | sudo tee $SUDOERSD_FILE
    echo "install ok"
    exit $EXIT_SUCCESS
fi

if [ "$ACTION" = "remove" ]
then
    sudo rm $SUDOERSD_FILE
    if ! [ -e $SUDOERSD_FILE ]
    then
        echo "remove ok"
        exit $EXIT_SUCCESS
    else
        echo "install failed"
        exit $EXIT_FAILED
    fi
    exit 0
fi

exit $EXIT_INVALID_ARG