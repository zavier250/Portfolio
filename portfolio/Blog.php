<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Blog extends CI_Controller {

    /**
     * Index Page for this controller.
     *
     * Maps to the following URL
     * 		http://example.com/index.php/welcome
     *	- or -
     * 		http://example.com/index.php/welcome/index
     *	- or -
     * Since this controller is set as the default controller in
     * config/routes.php, it's displayed at http://example.com/
     *
     * So any other public methods not prefixed with an underscore will
     * map to /index.php/welcome/<method_name>
     * @see https://codeigniter.com/user_guide/general/urls.html
     */
    public function index()
    {
        $query = $this->db->query("select * from `articles` order by blogid DESC");
        $data['result'] = $query->result_array();
        $this->load->view('adminpanel/viewblog',$data);
    }

    public function addblog()
    {
        $this->load->view('adminpanel/addblog');
    }

    public function addblog_post()
    {
        print_r($_POST);
        print_r($_FILES);
        if ($_FILES) {
            $config['upload_path']          = './uploads/blogimg/';
            $config['allowed_types']        = 'gif|jpg|png|jpeg';


            $this->load->library('upload', $config);

            if ( ! $this->upload->do_upload('file'))
            {
                $error = array('error' => $this->upload->display_errors());
                die('error');
//                $this->load->view('upload_form', $error);
            }
            else
            {
                $data = array('upload_data' => $this->upload->data());

                echo "<pre>";
                print_r($data);
                echo $data['upload_data']['file_name'];

                $fileurl = "uploads/blogimg/".$data['upload_data']['file_name'];
                $blog_title = $_POST['blog_title'];
                $desc = $_POST['desc'];

                $query = $this->db->query("insert into `articles`(`blog_title`,`blog_desc`,`blog_img`) values ('$blog_title','$desc','$fileurl')");
                if($query){
                    $this->session->set_flashdata('inserted','yes');
                    redirect('auth/blog/addblog');
                }else{
                    $this->session->set_flashdata('inserted','no');
                    redirect('auth/blog/addblog');
                }
//                $this->load->view('upload_success', $data);
            }
        } else {

        }
    }

    public function editblog($blog_id)
    {
        print_r($blog_id);
    }

    public function deleteblog($blog_id)
    {
        print_r($blog_id);
    }
}
