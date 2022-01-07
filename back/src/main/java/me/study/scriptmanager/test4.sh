echo 11111111111111111111
for ARGUMENT in "$@"
do
    KEY=$(echo $ARGUMENT | cut -f1 -d=)
    VALUE=$(echo $ARGUMENT | cut -f2 -d=)
    export "$KEY"=$VALUE
done
echo "$param"
echo "$param1"
echo "$param2"
echo 22222222222222222222