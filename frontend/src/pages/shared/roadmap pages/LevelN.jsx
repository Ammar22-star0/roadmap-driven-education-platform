// هنا نستخدم مستوى موضوع n للحصول على بيانات
import { useEffect, useState } from "react";
import {
  RightLine,
  LeftLine,
  StartLine,
  EndLineRight,
  EndLineLeft,
  Topic,
  Modal,
} from "../../../components";
import {
  useOutletContext,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import axios from "../../../apis/axios";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const LevelN = () => {
  const { auth, isAuth } = useAuth();

  const { roadmapId, topicL1Id, topicLnId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // حالة لحفظ رسالة الرد عند تغيير حالة الموضوعات!
  const [countUpdate, setCountUpdate] = useState(1);
  //the actual roadmap data
  const [mergedData, setMergedData] = useState([]);

  //getting the data
  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        `/roadmap/${
          !isAuth ? `topicN/${topicLnId}` : `student/topicN/${topicLnId}`
        }`,
        {
          headers: {
            token: auth.accessToken,
          },
        }
      );
      // setLevelN(response.data.topics);
      //consider if the user is not loged in so, I put "|| []"
      const progress = (await response.data.progress) || [];

      const mergedData = await response.data.topics.map((topic) => {
        const matchingProgress = progress.find(
          (item) => item.topic_id === topic.topic_id
        );
        return {
          topic_id: topic.topic_id,
          topic_title: topic.topic_title,
          topic_description: topic.topic_description,
          topic_status: topic.topic_status,
          topic_order: topic.topic_order,
          topic_category: topic.topic_category,
          isItLast: topic.isItLast,
          topic_level: topic.topic_level,
          state_name: matchingProgress ? matchingProgress.state_name : "",
        };
      });
      setMergedData(mergedData);
    };
    getData();
  }, [countUpdate]);

  // لمعرفة إذا كان الموضوع في المستوى الأخير.
  const [isLast, setIsLast] = useState(false);
  // const [levelN, setLevelN] = useState([
  //   {
  //     topic_id: 5,
  //     topic_title: "topic title",
  //     topic_description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos impedit distinctio ut, dolores ratione libero sint reprehenderit dolorem suscipit! Aspernatur aut dolorum deleniti sapiente eligendi? Alias reprehenderit nam ipsum placeat.",
  //     topic_order: 1,
  //     topic_status: "Trending",
  //     isItLast: false,
  //   },
  //   {
  //     topic_id: 6,
  //     topic_title: "topic title",
  //     topic_description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos impedit distinctio ut, dolores ratione libero sint reprehenderit dolorem suscipit! Aspernatur aut dolorum deleniti sapiente eligendi? Alias reprehenderit nam ipsum placeat.",
  //     topic_order: 2,
  //     topic_status: "Stable",
  //     isItLast: true,
  //   },
  //   {
  //     topic_id: 7,
  //     topic_title: "topic title",
  //     topic_description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos impedit distinctio ut, dolores ratione libero sint reprehenderit dolorem suscipit! Aspernatur aut dolorum deleniti sapiente eligendi? Alias reprehenderit nam ipsum placeat.",
  //     topic_order: 3,
  //     topic_status: "Stable",
  //     isItLast: true,
  //   },
  //   {
  //     topic_id: 8,
  //     topic_title: "topic title",
  //     topic_description:
  //       "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eos impedit distinctio ut, dolores ratione libero sint reprehenderit dolorem suscipit! Aspernatur aut dolorum deleniti sapiente eligendi? Alias reprehenderit nam ipsum placeat.",
  //     topic_order: 4,
  //     topic_status: "deprecated",
  //     isItLast: true,
  //   },
  // ]);
  //for the title of the page
  const [title, setTitle] = useOutletContext();
  // setTitle("FE") : I put it in a useEffect because of the warning in the console.
  useEffect(
    () =>
      setTitle(
        "topiC Level N"[0].toUpperCase() +
          "topiC Level N".slice(1).toLowerCase()
      ),
    []
  );
  //some styles
  const style =
    "p-4 rounded-md text-dark border-2 disabled:from-primary/50 disabled:to-accent/50";
  const important = "bg-gradient-to-r from-primary to-accent text-light";

  //for the modal:
  // الأولى تتعلق بحالة فتح النافذة المنبثقة.
  const [isOpen, setIsOpen] = useState(false);
  //modal data
  const [modalData, setModalData] = useState({
    id: "",
    level: "",
    title: "",
    deeper: "/",
    search: "/",
  });
  // التعامل مع حالات الموضوعات.
  const handleState = async (state) => {
    try {
      const res = await axios.post(
        "/roadmap/addState/student/state",
        JSON.stringify({
          topic_id: modalData.id,
          topic_level: modalData.level,
          state_id: state,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            token: auth.accessToken,
          },
        }
      );
      setCountUpdate((prev) => prev + 1);
      setIsOpen(false);
      toast.success(`topic state is updated successfully (${countUpdate})`);
    } catch (err) {
      if (err.response.status === 403)
        navigate("/student/login", { state: { from: location } });
    }
  };
  const handleReset = async () => {
    try {
      const res = await axios.delete(
        `/roadmap/addState/student/reset/${modalData.id}/${modalData.level}`,
        {
          headers: {
            "Content-Type": "application/json",
            token: auth.accessToken,
          },
        }
      );
      setCountUpdate((prev) => prev + 1);
      setIsOpen(false);
      toast.success(`topic state is updated successfully (${countUpdate})`);
    } catch (err) {
      if (err.response.status === 403)
        navigate("/student/login", { state: { from: location } });
    }
  };

  // وهذا المتغير مخصص للترميز داخل النافذة المنبثقة.
  let modalTemplate = (
    <div className="flex flex-col text-[20px] gap-6">
      <div>
        <h3>Change the state:</h3>
        <div className="flex justify-evenly mt-4">
          <button
            className={`${style} border-primary`}
            onClick={() => handleReset()}
          >
            Reset
          </button>
          <button
            className={`${style} border-accent`}
            onClick={() => handleState(3)}
          >
            Done
          </button>
          <button
            className={`${style} border-green`}
            onClick={() => handleState(2)}
          >
            Inprogress
          </button>
          <button
            className={`${style} border-advance`}
            onClick={() => handleState(1)}
          >
            Skip it
          </button>{" "}
        </div>
      </div>
      <div className="border-t-2 border-dark/20 pt-4">
        <h3>Or make another action:</h3>
        <div className="flex justify-evenly mt-4">
          {/* here we use the links state that we declare before */}
          <button
            onClick={() =>
              navigate(modalData.search, {
                state: { byText: false, level1: false },
              })
            }
            className={`${style} ${important}`}
          >
            Search for a course that cover this topic
          </button>
          <button
            onClick={() => {
              navigate(
                `/student/roadmaps/${roadmapId}/${topicL1Id}/${modalData.deeper}`
              );
              setIsOpen(false);
            }}
            className={`${style} ${important}`}
            disabled={isLast}
          >
            Go Deeper!
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <>
      {mergedData.map((topic, index) => {
        // إذا كان هناك موضوع واحد فقط.
        if (mergedData.length == 1) {
          return (
            <div key={topic.topic_id} className="w-full">
              <StartLine />
              <Topic
                topicId={topic.topic_id}
                setIsOpen={setIsOpen}
                topicTitle={topic.topic_title}
                topicDescription={topic.topic_description}
                topicStatus={topic.topic_status}
                last={topic.isItLast}
                setIsLast={setIsLast}
                modalData={setModalData}
                progressState={topic.state_name}
                topicLevel={topic.topic_level}
              />
              <EndLineRight />
            </div>
          );
        }
        // عرض الموضوع الأول.
        else if (index == 0) {
          return (
            <div key={topic.topic_id} className="w-full">
              <StartLine />
              <Topic
                topicId={topic.topic_id}
                setIsOpen={setIsOpen}
                topicTitle={topic.topic_title}
                topicDescription={topic.topic_description}
                topicStatus={topic.topic_status}
                last={topic.isItLast}
                setIsLast={setIsLast}
                modalData={setModalData}
                progressState={topic.state_name}
                topicLevel={topic.topic_level}
              />
              <RightLine />
            </div>
          );
          // عرض الموضوع الأخير.
        } else if (index == mergedData.length - 1) {
          // التحقق مما إذا كان الموضوع الأخير زوجي (وهذا يعني أن الموضوع على الجانب الأيمن).
          if (index % 2 == 0)
            return (
              <div key={topic.topic_id} className="w-full">
                <Topic
                  topicId={topic.topic_id}
                  setIsOpen={setIsOpen}
                  topicTitle={topic.topic_title}
                  topicDescription={topic.topic_description}
                  topicStatus={topic.topic_status}
                  last={topic.isItLast}
                  setIsLast={setIsLast}
                  modalData={setModalData}
                  progressState={topic.state_name}
                  topicLevel={topic.topic_level}
                />{" "}
                <EndLineRight />
              </div>
            );
          // إذا لم يكن كذلك، فهو على الجانب الأيسر.
          else
            return (
              <div key={topic.topic_id} className="w-full">
                <Topic
                  topicId={topic.topic_id}
                  setIsOpen={setIsOpen}
                  topicTitle={topic.topic_title}
                  topicDescription={topic.topic_description}
                  topicStatus={topic.topic_status}
                  last={topic.isItLast}
                  setIsLast={setIsLast}
                  isRight={false}
                  modalData={setModalData}
                  progressState={topic.state_name}
                  topicLevel={topic.topic_level}
                />
                <EndLineLeft />
              </div>
            );
          // عرض الموضوع الزوجي (الجانب الأيمن).
        } else if (index % 2 == 0) {
          return (
            <div key={topic.topic_id} className="w-full">
              <Topic
                topicId={topic.topic_id}
                setIsOpen={setIsOpen}
                topicTitle={topic.topic_title}
                topicDescription={topic.topic_description}
                topicStatus={topic.topic_status}
                last={topic.isItLast}
                setIsLast={setIsLast}
                modalData={setModalData}
                progressState={topic.state_name}
                topicLevel={topic.topic_level}
              />{" "}
              <RightLine />
            </div>
          );
          // الحالة النهائية هي عرض الموضوع على الجانب الأيسر.
        } else {
          return (
            <div key={topic.topic_id} className="w-full">
              <Topic
                topicId={topic.topic_id}
                setIsOpen={setIsOpen}
                topicTitle={topic.topic_title}
                topicDescription={topic.topic_description}
                topicStatus={topic.topic_status}
                last={topic.isItLast}
                setIsLast={setIsLast}
                isRight={false}
                modalData={setModalData}
                progressState={topic.state_name}
                topicLevel={topic.topic_level}
              />
              <LeftLine />
            </div>
          );
        }
      })}

      <Modal
        isOpen={isOpen}
        content={modalTemplate}
        title={modalData.title}
        close={() => setIsOpen(false)}
      />
    </>
  );
};

export default LevelN;
